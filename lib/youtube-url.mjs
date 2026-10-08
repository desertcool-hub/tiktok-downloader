const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com']);

export function parseYoutubeUrl(raw) {
  try {
    if (typeof raw !== 'string') throw new Error();
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port) throw new Error();
    let id;
    if (url.hostname === 'youtu.be') {
      id = url.pathname.match(/^\/([A-Za-z0-9_-]{11})\/?$/)?.[1];
    } else if (HOSTS.has(url.hostname)) {
      if (url.pathname === '/watch') {
        const values = url.searchParams.getAll('v');
        if (values.length === 1) id = values[0];
      } else {
        id = url.pathname.match(/^\/(?:shorts|embed|live)\/([A-Za-z0-9_-]{11})\/?$/)?.[1];
      }
    }
    if (!VIDEO_ID.test(id || '')) throw new Error();
    return { id, url: `https://www.youtube.com/watch?v=${id}` };
  } catch {
    throw Object.assign(new Error('Please enter a valid HTTPS YouTube video URL.'), { code: 'INVALID_URL' });
  }
}

export function looksLikeYoutube(raw) {
  try { parseYoutubeUrl(raw); return true; } catch { return false; }
}
