import { attachmentHeader, DownloadError, fetchPlatformMedia, isMp4, isPlatformMediaUrl, readPrefix } from './platform-media.mjs';
import { decryptWxBytes, decryptWxStream, validateWxKey } from './weixin-decrypt.mjs';

const HEADERS = { 'User-Agent': 'Mozilla/5.0', Referer: 'https://channels.weixin.qq.com/' };
const defaultFetch = (url, options) => fetchPlatformMedia(url, 'weixin', { headers: HEADERS, ...options });

export async function wxMediaResponse({ url, key = '', name = '视频号视频', probe = false, inline = false,
  range, signal, fetchMedia = defaultFetch }) {
  if (!isPlatformMediaUrl(url, 'weixin')) throw new DownloadError('无效的视频号媒体地址', 'INVALID_URL', 400);
  if (key !== '') {
    try { key = validateWxKey(key); }
    catch (e) { throw new DownloadError(e.message, 'INVALID_KEY', 400); }
  }
  if (range && !/^bytes=(?:\d+-\d*|-\d+)$/.test(range)) throw new DownloadError('不支持该下载范围', 'INVALID_RANGE', 416);
  if (inline) {
    const response = await fetchMedia(url, { signal });
    const type = response.headers.get('content-type') || '';
    if (!/^image\/(jpeg|png|webp|gif)(?:;|$)/i.test(type)) {
      await response.body.cancel();
      throw new DownloadError('该地址不是受支持的图片', 'NOT_IMAGE', 400);
    }
    return new Response(response.body, { headers: { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  }
  const sample = await fetchMedia(url, { range: 'bytes=0-15', signal });
  const { prefix, body: sampleBody } = await readPrefix(sample.body);
  await sampleBody.cancel();
  const type = sample.headers.get('content-type') || '';
  if (/text\/|application\/(?:json|xml)/i.test(type)) throw new DownloadError('下载源返回的不是视频文件，请重新获取直链', 'NOT_VIDEO', 422);
  const encrypted = !isMp4(prefix);
  if (encrypted && !key) throw new DownloadError('此视频需要解密密钥，请同时粘贴电脑端获取的 decodeKey', 'KEY_REQUIRED', 422);
  if (encrypted && !isMp4(decryptWxBytes(prefix, key))) throw new DownloadError('密钥不正确或文件不是受支持的 MP4，请重新获取视频地址与密钥', 'INVALID_KEY', 422);
  const total = sample.headers.get('content-range')?.match(/\/(\d+)$/)?.[1] ||
    (sample.status === 200 ? sample.headers.get('content-length') : null);
  if (probe) return Response.json({ success: true, contentType: 'video/mp4', bytes: Number(total || 0), encrypted, decrypted: encrypted, ext: '.mp4' }, { headers: { 'Cache-Control': 'no-store' } });
  const response = await fetchMedia(url, { range, signal });
  let offset = 0;
  const contentRange = response.headers.get('content-range');
  if (response.status === 206) {
    const match = contentRange?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);
    if (!match) { await response.body.cancel(); throw new DownloadError('下载源返回的分段信息无效', 'INVALID_RANGE', 502); }
    offset = Number(match[1]);
  }
  let body = encrypted ? decryptWxStream(response.body, key, offset) : response.body;
  if (offset === 0) {
    const checked = await readPrefix(body);
    if (!isMp4(checked.prefix)) { await checked.body.cancel(); throw new DownloadError('视频内容已变化，请重新获取链接', 'NOT_VIDEO', 422); }
    body = checked.body;
  }
  const headers = new Headers({ 'Content-Type': 'video/mp4', 'Content-Disposition': attachmentHeader(name),
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' });
  const size = response.headers.get('content-length');
  if (size) headers.set('Content-Length', size);
  if (contentRange) headers.set('Content-Range', contentRange);
  return new Response(body, { status: response.status, headers });
}
