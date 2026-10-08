export function youtubeDownloadUrl(raw, name) {
  if (typeof raw !== 'string' || !raw.startsWith('/api/youtube?') || /[\s\\#]/.test(raw)) return null;
  const url = new URL(raw, 'https://vidsavenow.invalid');
  if (url.pathname !== '/api/youtube' || url.searchParams.getAll('token').length !== 1 || !url.searchParams.get('token')) return null;
  if ([...url.searchParams.keys()].some(key => key !== 'token' && key !== 'name')) return null;
  url.searchParams.set('name', name);
  return `${url.pathname}${url.search}`;
}

export function youtubeCoverUrl(raw) {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && url.hostname === 'i.ytimg.com' && !url.port && !url.username && !url.password
      && /^\/vi\/[A-Za-z0-9_-]{11}\/hqdefault\.jpg$/.test(url.pathname) ? url.href : null;
  } catch { return null; }
}
