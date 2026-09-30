import { NextResponse } from 'next/server';
import { isTikTokUrl, parseTikTok } from '@/lib/providers';
import { rateLimit, clientIp } from '@/lib/ratelimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 云端转发模式：设置 BACKEND_URL 后，本实例只做接入层（限流/校验），
 * 解析请求转发到家庭/VPS 后端（住宅 IP 出口，不会被 TikTok 反爬拦截）。
 * 未设置时本实例自行解析（本地开发模式）。
 */
const BACKEND = process.env.BACKEND_URL;

/** POST /api/parse  body: { url: "https://www.tiktok.com/@xxx/video/123" } */
export async function POST(req) {
  // 限流：单 IP 每分钟 15 次
  const ip = clientIp(req);
  const rl = rateLimit(`parse:${ip}`, 15, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, error: `请求太频繁，请 ${rl.retryAfter} 秒后再试` },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: '请求格式错误' }, { status: 400 });
  }

  const url = String(body?.url || '').trim();
  if (!url) {
    return NextResponse.json({ success: false, error: '请输入 TikTok 视频链接' }, { status: 400 });
  }
  if (!isTikTokUrl(url)) {
    return NextResponse.json(
      { success: false, error: '请输入有效的 TikTok 链接（以 tiktok.com 开头，含分享短链）' },
      { status: 400 }
    );
  }

  try {
    if (BACKEND) {
      const r = await fetch(`${BACKEND}/api/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
      });
      const j = await r.json().catch(() => null);
      return NextResponse.json(
        j ?? { success: false, error: '后端不可达，请稍后重试' },
        { status: r.status }
      );
    }
    const { result, errors } = await parseTikTok(url);
    if (!result) {
      console.error('[parse] all providers failed:', JSON.stringify(errors));
      return NextResponse.json(
        {
          success: false,
          error: '解析失败：视频可能已被删除、设为私密，或解析服务暂时不可用，请稍后重试',
        },
        { status: 502 }
      );
    }
    return NextResponse.json({ success: true, video: result });
  } catch (e) {
    console.error('[parse] unexpected:', e);
    return NextResponse.json({ success: false, error: '服务器内部错误，请稍后重试' }, { status: 500 });
  }
}
