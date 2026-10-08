import { fetchTweet } from 'react-tweet/api';
import { DownloadError, extractUrl, fetchJson, isPlatformMediaUrl } from './platform-media.mjs';

export function parseXUrl(raw) {
  try {
    const u = new URL(extractUrl(raw));
    const match = u.pathname.match(/^\/(?:[A-Za-z0-9_]+|i\/web)\/status\/(\d{2,20})(?:\/(?:video|photo)\/\d+)?\/?$/);
    if (u.protocol !== 'https:' || u.username || u.password || u.port ||
      !/^(?:(?:www|mobile|m)\.)?(x|twitter)\.com$/i.test(u.hostname) || !match) throw new Error();
    return { id: match[1], url: `https://x.com/i/status/${match[1]}` };
  } catch { throw new DownloadError('请粘贴 X 或 Twitter 的帖子链接', 'INVALID_URL', 400); }
}

function variants(media) {
  const candidates = media.video_info?.variants || media.formats || media.variants || [];
  const all = [...candidates];
  if (media.url) all.push({ url: media.url, bitrate: 0 });
  const unique = new Map();
  for (const v of all) {
    if (!isPlatformMediaUrl(v.url, 'x') || new URL(v.url).hostname !== 'video.twimg.com' ||
      !new URL(v.url).pathname.endsWith('.mp4')) continue;
    const dimensions = v.url.match(/\/(\d+)x(\d+)\//);
    const resolution = dimensions ? Math.min(Number(dimensions[1]), Number(dimensions[2])) : 0;
    const format = { url: v.url, type: 'video', bitrate: Number(v.bitrate || 0), resolution,
      label: resolution ? `${resolution}p` : 'MP4' };
    if (!unique.has(v.url) || unique.get(v.url).bitrate < format.bitrate) unique.set(v.url, format);
  }
  return [...unique.values()].sort((a, b) => b.bitrate - a.bitrate || b.resolution - a.resolution);
}

export function normalizeXTweet(tweet) {
  if (!tweet) return [];
  const list = tweet.mediaDetails || tweet.media?.videos || [];
  const author = tweet.author || tweet.user || {};
  const videos = list.filter(m => ['video', 'animated_gif', 'gif'].includes(m.type) || m.video_info || m.formats || m.url)
    .map((m, index) => ({
      id: String(m.id_str || m.id || `${tweet.id_str || tweet.id || 'x'}-${index + 1}`),
      title: String(tweet.text || 'X 视频').slice(0, 1000),
      cover: isPlatformMediaUrl(m.thumbnail_url || m.media_url_https, 'x') ? m.thumbnail_url || m.media_url_https : '',
      author: { name: String(author.name || author.screen_name || ''), avatar: '' },
      duration: Number(m.duration || 0), formats: variants(m),
    })).filter(v => v.formats.length);
  if (!videos.length && (tweet.quoted_tweet || tweet.quote)) return normalizeXTweet(tweet.quoted_tweet || tweet.quote);
  return videos;
}

export async function parseXVideo(raw, { fetchTweetImpl = fetchTweet, fetchImpl = fetch } = {}) {
  const { id, url } = parseXUrl(raw);
  let foundPost = false;
  let unavailable = false;
  try {
    const result = await fetchTweetImpl(id, { cache: 'no-store', signal: AbortSignal.timeout(10_000), redirect: 'error' });
    foundPost = !!result.data;
    unavailable = !!(result.notFound || result.tombstone);
    const videos = normalizeXTweet(result.data);
    if (videos.length) return { url, videos, source: 'syndication' };
  } catch { /* The public embed endpoint is sometimes blocked; try FxEmbed. */ }
  try {
    const { response, json } = await fetchJson(`https://api.fxtwitter.com/2/status/${id}`, { fetchImpl, timeoutMs: 12_000 });
    if (response.ok && json.code === 200) {
      foundPost ||= !!(json.status || json.tweet);
      const videos = normalizeXTweet(json.status || json.tweet);
      if (videos.length) return { url, videos, source: 'fxembed' };
    }
    unavailable ||= response.status === 404 || json.code === 404 || json.status?.type === 'tombstone';
  } catch { /* Return an actionable error without leaking upstream response details. */ }
  if (foundPost && !unavailable) throw new DownloadError('该帖子没有可下载的 MP4 视频；直播或仅图片的帖子暂不支持', 'NO_VIDEO', 422);
  throw new DownloadError('无法获取视频：帖子可能已删除、需要登录，或解析服务暂时不可用', 'POST_UNAVAILABLE', unavailable ? 404 : 502);
}
