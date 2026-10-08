import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/ratelimit';
import { attachmentHeader, fetchPlatformMedia, isPlatformMediaUrl } from '@/lib/platform-media.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req) {
  const rl = rateLimit(`xdl:${clientIp(req)}`, 40, 60_000);
  if (!rl.ok) return NextResponse.json({ success: false, error: '请求太频繁，请稍后重试' }, { status: 429 });
  const p = new URL(req.url).searchParams;
  const url = p.get('u');
  const inline = p.get('inline') === '1';
  if (!isPlatformMediaUrl(url, 'x') || (!inline &&
    (new URL(url).hostname !== 'video.twimg.com' || !new URL(url).pathname.endsWith('.mp4'))))
    return NextResponse.json({ success: false, error: '无效的 X 媒体地址' }, { status: 400 });
  const range = req.headers.get('range');
  if (range && !/^bytes=(?:\d+-\d*|-\d+)$/.test(range)) return NextResponse.json({ success: false, error: '下载范围无效' }, { status: 416 });
  try {
    const response = await fetchPlatformMedia(url, 'x', { range, signal: req.signal,
      headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://x.com/' } });
    const type = response.headers.get('content-type') || '';
    const allowedType = inline ? /^image\/(jpeg|png|webp|gif)(?:;|$)/i.test(type) : /^(video\/mp4|application\/octet-stream)(?:;|$)/i.test(type);
    if (!allowedType) { await response.body.cancel(); return NextResponse.json({ success: false, error: '下载源未返回受支持的媒体文件' }, { status: 502 }); }
    const headers = new Headers({ 'Content-Type': inline ? type : 'video/mp4', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    for (const key of ['content-length', 'content-range', 'accept-ranges']) {
      const value = response.headers.get(key); if (value) headers.set(key, value);
    }
    if (!inline) headers.set('Content-Disposition', attachmentHeader(p.get('name')));
    return new Response(response.body, { status: response.status, headers });
  } catch (e) { return NextResponse.json({ success: false, error: e.code ? e.message : '下载源暂时不可用，请重新解析后重试' }, { status: e.status || 502 }); }
}
