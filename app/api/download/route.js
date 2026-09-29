import { NextResponse } from 'next/server';
import { isAllowedMediaUrl, DOWNLOAD_HEADERS } from '@/lib/providers';
import { rateLimit, clientIp } from '@/lib/ratelimit';
import { fetchAllowedMedia } from '@/lib/media-fetch.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UA = DOWNLOAD_HEADERS['User-Agent'];

function extFromType(ct) {
  if (!ct) return '';
  if (ct.includes('mp4')) return '.mp4';
  if (ct.includes('jpeg')) return '.jpg';
  if (ct.includes('png')) return '.png';
  if (ct.includes('webp')) return '.webp';
  return '';
}

/** 清洗文件名：去控制字符（防响应头注入）与路径非法字符，限长 */
function sanitizeName(name) {
  const cleaned = String(name)
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[\\/:*?"<>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  return cleaned || 'tiktok-video';
}

/**
 * GET /api/download?u=<媒体地址>&name=<文件名>&inline=1
 * 服务端代理下载：绕过跨域，并带上 TikTok CDN 需要的请求头。
 * inline=1 时不加 Content-Disposition（用于封面/头像展示）。
 */
export async function GET(req) {
  const ip = clientIp(req);
  // 限流：单 IP 每分钟 40 次
  const rl = rateLimit(`dl:${ip}`, 40, 60_000);
  if (!rl.ok) {
    return new NextResponse('请求太频繁，请稍后再试', { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const target = searchParams.get('u');
  const name = searchParams.get('name') || 'tiktok-video';
  const inline = searchParams.get('inline') === '1';

  if (!target || !isAllowedMediaUrl(target)) {
    return new NextResponse('无效的下载地址', { status: 400 });
  }

  const range = req.headers.get('range') || undefined;

  // 不同 CDN 域对请求头要求不同，依次尝试多组请求头
  const UA_COMBOS = [
    { 'User-Agent': UA, Referer: 'https://www.tiktok.com/', 'Accept-Language': 'en-US,en;q=0.9' },
    { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
    {
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
      Referer: 'https://www.tiktok.com/',
    },
  ];

  let upstream = null;
  let lastStatus = 0;
  let blockedRedirect = false;
  let tooManyRedirects = false;
  for (const combo of UA_COMBOS) {
    try {
      const result = await fetchAllowedMedia(target, {
        headers: combo,
        range,
      });
      const resp = result.response;
      lastStatus = result.lastStatus;
      blockedRedirect = result.blockedRedirect === true;
      tooManyRedirects = result.tooManyRedirects === true;
      if (!resp) break;
      if (resp.ok || resp.status === 206) {
        upstream = resp;
        break;
      }
      // 仅对可重试的状态码换下一组请求头，4xx 中的 401/403 通常是签名过期，重试意义不大但也尝试一次
    } catch (e) {
      console.error('[download] fetch failed:', e?.message);
    }
  }

  if (!upstream) {
    if (blockedRedirect) return new NextResponse('下载源跳转到不允许的地址', { status: 400 });
    if (tooManyRedirects) return new NextResponse('下载源跳转次数过多', { status: 502 });
    return new NextResponse(
      `下载源返回 ${lastStatus || '错误'}，链接可能已过期，请重新解析`,
      { status: 502 }
    );
  }

  const headers = new Headers();
  const ct = upstream.headers.get('content-type');
  if (ct) headers.set('Content-Type', ct);
  const cl = upstream.headers.get('content-length');
  if (cl) headers.set('Content-Length', cl);
  const cr = upstream.headers.get('content-range');
  if (cr) headers.set('Content-Range', cr);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'no-store');

  if (!inline) {
    const ext = extFromType(ct);
    const fullName = `${sanitizeName(name)}${ext}`;
    // RFC 5987：ASCII 兜底 + UTF-8 完整名（中文标题在各浏览器都能正确落盘）
    const asciiName = fullName.replace(/[^\x20-\x7e]/g, '_');
    headers.set(
      'Content-Disposition',
      `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fullName)}`
    );
  }

  return new NextResponse(upstream.body, { status: upstream.status, headers });
}
