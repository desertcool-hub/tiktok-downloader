import { DownloadError, extractUrl, fetchJson, isPlatformMediaUrl } from './platform-media.mjs';
import { validateWxKey } from './weixin-decrypt.mjs';

export function isWxShareUrl(raw) {
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' && !u.username && !u.password && !u.port &&
      (u.hostname === 'channels.weixin.qq.com' || (u.hostname === 'weixin.qq.com' && u.pathname.startsWith('/sph/')));
  } catch { return false; }
}

export function normalizeWxRecord(record) {
  if (!record || typeof record !== 'object') throw new DownloadError('视频记录格式错误', 'INVALID_RECORD', 400);
  const object = record.object || record;
  const desc = object.objectDesc;
  const media = desc?.media?.[0] || record;
  let url = String(media.videoUrl || media.video_url || media.url || '').trim();
  const token = media.urlToken || media.url_token;
  if (token) url += String(token).startsWith('&') || String(token).startsWith('?') ? String(token) : `&${token}`;
  if (!isPlatformMediaUrl(url, 'weixin')) throw new DownloadError('记录中的视频地址不受支持，请重新获取视频号直链', 'INVALID_URL', 400);
  let key = media.decodeKey ?? media.decryptKey ?? media.decode_key ?? media.key ?? '';
  if (key !== '') {
    try { key = validateWxKey(key); }
    catch (e) { throw new DownloadError(e.message, 'INVALID_KEY', 400); }
  }
  const author = object.author;
  const cover = media.thumbUrl || media.coverUrl || record.coverUrl || record.cover_url || '';
  return {
    id: String(object.id || record.id || ''), url, key,
    title: String(desc?.description || object.title || '视频号视频').slice(0, 500),
    author: { name: String(record.authorName || (typeof author === 'string' ? author : author?.nickname || author?.name) ||
      object.nickname || object.contact?.nickname || ''), avatar: '' },
    cover: isPlatformMediaUrl(cover, 'weixin') ? cover : '',
    duration: Number(media.videoPlayLen || record.durationMs / 1000 || record.duration / 1000 || 0),
    bytes: Number(media.fileSize || record.size || 0),
    formats: [{ url, label: String(record.resolution || 'MP4'), type: 'video' }],
  };
}

export function importWxRecords(text) {
  if (text.length > 1_000_000) throw new Error('记录文件过大，最多支持 1 MB');
  let json;
  try { json = JSON.parse(text.replace(/^\uFEFF/, '')); } catch { throw new Error('JSON 格式错误，请导入原始 JSON 导出文件'); }
  const records = Array.isArray(json) ? json : json.data?.items || json.data?.resolved || json.items || json.resolved || [json];
  if (!Array.isArray(records) || !records.length || records.length > 100) throw new Error('一次可导入 1 至 100 条视频记录');
  const unique = new Map();
  for (const raw of records) {
    const video = normalizeWxRecord(raw);
    const previous = unique.get(video.url);
    unique.set(video.url, previous ? { ...previous, key: video.key || previous.key } : video);
  }
  return [...unique.values()];
}

export async function resolveWxShare(url, { channelUrl, channelToken, parserUrl, fetchImpl = fetch } = {}) {
  if (!isWxShareUrl(url)) throw new DownloadError('请粘贴有效的视频号分享链接', 'INVALID_URL', 400);
  if (channelUrl) {
    const { response, json } = await fetchJson(`${channelUrl.replace(/\/$/, '')}/api/channels/share/resolve`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...(channelToken ? { Authorization: `Bearer ${channelToken}` } : {}) },
      body: JSON.stringify({ urls: [url] }), timeoutMs: 25_000, fetchImpl,
    });
    if (response.ok && json.code === 0 && json.data?.resolved?.[0]) return normalizeWxRecord(json.data.resolved[0]);
    if (json.data?.failed?.[0]?.errorCode === 'no_ready_client' || response.status === 503)
      throw new DownloadError('电脑端微信尚未连接，请打开视频号并保持下载助手运行', 'WECHAT_OFFLINE', 503);
    throw new DownloadError('视频号分享链接解析失败，请在电脑端打开该视频后重试', 'SHARE_FAILED');
  }
  if (parserUrl) {
    const { response, json } = await fetchJson(`${parserUrl.replace(/\/$/, '')}/api/v1/parse?url=${encodeURIComponent(url)}`, { fetchImpl, timeoutMs: 25_000 });
    if (json.error_code === 'WECHAT_CHANNELS_COOKIE_REQUIRED') throw new DownloadError('分享链接解析服务的登录凭证未配置或已过期，请联系站点维护者', 'CREDENTIAL_EXPIRED', 503);
    if (response.ok && json.retcode === 200 && json.data?.video_url) return normalizeWxRecord(json.data);
    throw new DownloadError('分享链接暂时无法解析，请导入电脑端获取的视频记录', 'SHARE_FAILED');
  }
  throw new DownloadError('分享链接解析尚未启用。请使用视频直链，或导入电脑端下载助手的 JSON 视频记录', 'SHARE_UNAVAILABLE', 503);
}

export function wxInputUrl(value) { return extractUrl(value); }
