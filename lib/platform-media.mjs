const HOSTS = {
  x: /^(video|pbs)\.twimg\.com$/i,
  weixin: /(^|\.)(video\.qq\.com|mpvideo\.qpic\.cn|mmbiz\.qpic\.cn|wx\.qlogo\.cn)$/i,
};
const REDIRECTS = new Set([301, 302, 303, 307, 308]);

export class DownloadError extends Error {
  constructor(message, code = 'UPSTREAM_ERROR', status = 502) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function isPlatformMediaUrl(raw, platform) {
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' && !u.username && !u.password && !u.port &&
      !!HOSTS[platform]?.test(u.hostname);
  } catch { return false; }
}

export function extractUrl(text) {
  return String(text || '').trim().match(/https?:\/\/[^\s<>"\u3000]+/i)?.[0]
    .replace(/[，。；！）】]+$/, '') || '';
}

export function attachmentHeader(name, extension = '.mp4') {
  const base = String(name || 'video').replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100) || 'video';
  const full = base.toLowerCase().endsWith(extension) ? base : `${base}${extension}`;
  return `attachment; filename="${full.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(full)}`;
}

export async function fetchJson(url, { timeoutMs = 20_000, fetchImpl = fetch, ...options } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, { ...options, signal: controller.signal, redirect: 'error', cache: 'no-store' });
    const json = await response.json();
    return { response, json };
  } finally { clearTimeout(timer); }
}

export async function fetchPlatformMedia(target, platform, {
  headers = {}, range, signal, fetchImpl = fetch, timeoutMs = 60_000,
} = {}) {
  if (!isPlatformMediaUrl(target, platform)) throw new DownloadError('无效的媒体地址', 'INVALID_URL', 400);
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });
  if (signal?.aborted) controller.abort();
  const timer = setTimeout(onAbort, timeoutMs);
  const cleanup = () => { clearTimeout(timer); signal?.removeEventListener('abort', onAbort); };
  try {
    let url = target;
    for (let redirects = 0; redirects <= 3; redirects++) {
      const response = await fetchImpl(url, {
        headers: { ...headers, ...(range ? { Range: range } : {}) },
        signal: controller.signal, redirect: 'manual', cache: 'no-store',
      });
      if (REDIRECTS.has(response.status)) {
        const location = response.headers.get('location');
        await response.body?.cancel();
        const next = location ? new URL(location, url).toString() : '';
        if (!isPlatformMediaUrl(next, platform)) throw new DownloadError('下载源跳转到不允许的地址', 'BLOCKED_REDIRECT', 400);
        url = next;
        continue;
      }
      if (!response.ok) {
        await response.body?.cancel();
        throw new DownloadError(response.status === 416 ? '下载范围无效' : '视频链接已过期或下载源暂时不可用，请重新获取链接',
          'MEDIA_UNAVAILABLE', response.status === 416 ? 416 : 502);
      }
      if (!response.body) throw new DownloadError('下载源没有返回文件');
      const reader = response.body.getReader();
      const body = new ReadableStream({
        async pull(c) {
          try {
            const { done, value } = await reader.read();
            if (done) { cleanup(); c.close(); } else c.enqueue(value);
          } catch (e) { cleanup(); c.error(e); }
        },
        async cancel(reason) { cleanup(); controller.abort(); await reader.cancel(reason); },
      });
      return new Response(body, { status: response.status, headers: response.headers });
    }
    throw new DownloadError('下载源跳转次数过多');
  } catch (e) { cleanup(); controller.abort(); throw e; }
}

export async function readPrefix(stream, minimum = 16) {
  const reader = stream.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (size < minimum) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); size += value.length;
    }
    const prefix = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { prefix.set(chunk, offset); offset += chunk.length; }
    return { prefix, body: new ReadableStream({
      start(c) { if (prefix.length) c.enqueue(prefix); },
      async pull(c) {
        try { const { done, value } = await reader.read(); if (done) c.close(); else c.enqueue(value); }
        catch (e) { c.error(e); }
      },
      cancel(reason) { return reader.cancel(reason); },
    }) };
  } catch (e) { await reader.cancel().catch(() => {}); throw e; }
}

export function isMp4(bytes) {
  return bytes.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70;
}
