import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/ratelimit';
import { normalizeWxRecord, resolveWxShare, isWxShareUrl, wxInputUrl } from '@/lib/weixin.mjs';
import { fetchJson, isPlatformMediaUrl } from '@/lib/platform-media.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export function GET() {
  return NextResponse.json({ shareAvailable: !!(process.env.WX_CHANNEL_URL || process.env.MEDIA_PARSER_URL || process.env.BACKEND_URL) },
    { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req) {
  const rl = rateLimit(`wxparse:${clientIp(req)}`, 15, 60_000);
  if (!rl.ok) return NextResponse.json({ success: false, error: `请求太频繁，请 ${rl.retryAfter} 秒后再试` }, { status: 429 });
  let input;
  try { input = await req.json(); } catch { return NextResponse.json({ success: false, error: '请求格式错误' }, { status: 400 }); }
  if (typeof input?.url !== 'string') return NextResponse.json({ success: false, error: '请粘贴有效的视频号链接' }, { status: 400 });
  const url = wxInputUrl(input.url);
  if (String(input.url || '').length > 8192 || (!isWxShareUrl(url) && !isPlatformMediaUrl(url, 'weixin')))
    return NextResponse.json({ success: false, error: '请粘贴有效的视频号分享链接或视频直链' }, { status: 400 });
  try {
    if (isPlatformMediaUrl(url, 'weixin')) return NextResponse.json({ success: true, video: normalizeWxRecord({ url, key: input.key ?? '' }) });
    if (process.env.BACKEND_URL) {
      if (req.headers.get('x-vidsavenow-forwarded')) throw new Error('Backend loop');
      const { response, json } = await fetchJson(`${process.env.BACKEND_URL.replace(/\/$/, '')}/api/wxparse`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-VidSaveNow-Forwarded': '1',
          ...(process.env.BACKEND_TOKEN ? { Authorization: `Bearer ${process.env.BACKEND_TOKEN}` } : {}) },
        body: JSON.stringify({ url }), timeoutMs: 30_000,
      });
      if (!response.ok || !json.success) return NextResponse.json(json, { status: response.status });
      return NextResponse.json({ success: true, video: normalizeWxRecord({ ...json.video,
        url: json.video.url || json.video.formats?.[0]?.url }) });
    }
    const video = await resolveWxShare(url, {
      channelUrl: process.env.WX_CHANNEL_URL, channelToken: process.env.WX_CHANNEL_TOKEN,
      parserUrl: process.env.MEDIA_PARSER_URL,
    });
    return NextResponse.json({ success: true, video }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return NextResponse.json({ success: false, code: e.code || 'SERVICE_UNAVAILABLE',
      error: e.code ? e.message : '视频号解析服务暂时不可用，请稍后重试或导入视频记录' }, { status: e.status || 502 });
  }
}
