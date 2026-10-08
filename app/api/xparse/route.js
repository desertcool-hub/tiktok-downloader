import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/ratelimit';
import { parseXVideo } from '@/lib/x-provider.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req) {
  const rl = rateLimit(`xparse:${clientIp(req)}`, 15, 60_000);
  if (!rl.ok) return NextResponse.json({ success: false, error: `请求太频繁，请 ${rl.retryAfter} 秒后再试` }, { status: 429 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ success: false, error: '请求格式错误' }, { status: 400 }); }
  if (typeof body?.url !== 'string' || body.url.length > 8192) return NextResponse.json({ success: false, error: '请粘贴有效的帖子链接' }, { status: 400 });
  try {
    const result = await parseXVideo(body.url);
    return NextResponse.json({ success: true, ...result }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) { return NextResponse.json({ success: false, code: e.code || 'PARSE_FAILED', error: e.code ? e.message : '解析服务暂时不可用，请稍后重试' }, { status: e.status || 502 }); }
}
