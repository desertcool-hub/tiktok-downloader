import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/ratelimit';
import { wxMediaResponse } from '@/lib/weixin-download.mjs';
import { isPlatformMediaUrl } from '@/lib/platform-media.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function download(req, input) {
  const rl = rateLimit(`wxdl:${clientIp(req)}`, 40, 60_000);
  if (!rl.ok) return NextResponse.json({ success: false, error: `请求太频繁，请 ${rl.retryAfter} 秒后再试` }, { status: 429 });
  if (!isPlatformMediaUrl(input.url, 'weixin')) return NextResponse.json({ success: false, error: '无效的视频号媒体地址' }, { status: 400 });
  try {
    if (process.env.BACKEND_URL) {
      if (req.headers.get('x-vidsavenow-forwarded')) throw new Error('Backend loop');
      const response = await fetch(`${process.env.BACKEND_URL.replace(/\/$/, '')}/api/wxdownload`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-VidSaveNow-Forwarded': '1',
          ...(req.headers.get('range') ? { Range: req.headers.get('range') } : {}),
          ...(process.env.BACKEND_TOKEN ? { Authorization: `Bearer ${process.env.BACKEND_TOKEN}` } : {}) },
        body: JSON.stringify(input), signal: AbortSignal.any([req.signal, AbortSignal.timeout(55_000)]),
        cache: 'no-store', redirect: 'error',
      });
      const headers = new Headers({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      for (const key of ['content-type', 'content-length', 'content-range', 'content-disposition', 'accept-ranges']) {
        const value = response.headers.get(key); if (value) headers.set(key, value);
      }
      return new Response(response.body, { status: response.status, headers });
    }
    return await wxMediaResponse({ ...input, range: req.headers.get('range'), signal: req.signal });
  } catch (e) {
    return NextResponse.json({ success: false, code: e.code || 'DOWNLOAD_FAILED',
      error: e.code ? e.message : '下载失败，请检查密钥与链接，或稍后重试' }, { status: e.status || 502 });
  }
}

export function GET(req) {
  const p = new URL(req.url).searchParams;
  return download(req, { url: p.get('u'), name: p.get('name'), probe: p.get('probe') === '1', inline: p.get('inline') === '1' });
}

export async function POST(req) {
  try {
    const input = await req.json();
    return await download(req, { url: input.url, key: input.key ?? '', name: input.name,
      probe: input.probe === true, inline: input.inline === true });
  } catch { return NextResponse.json({ success: false, error: '请求格式错误' }, { status: 400 }); }
}
