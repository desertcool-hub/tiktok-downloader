const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

/** 允许代理下载的媒体域名白名单（防止被当作任意 SSRF 代理） */
const ALLOWED_MEDIA_HOST_RE =
  /(^|\.)(tiktok\.com|tiktokcdn\.com|tiktokcdn-us\.com|tiktokcdn-eu\.com|tiktokv\.com|tiktokv\.us|byteoversea\.net|ibyteimg\.com|muscdn\.com|tikwm\.com|akamaized\.net)$/i;

export function isAllowedMediaUrl(raw) {
  try {
    const u = new URL(String(raw));
    if (!/^https?:$/.test(u.protocol)) return false;
    return ALLOWED_MEDIA_HOST_RE.test(u.hostname);
  } catch {
    return false;
  }
}

export function resolveAllowedRedirect(currentUrl, location) {
  try {
    const nextUrl = new URL(location, currentUrl).toString();
    return isAllowedMediaUrl(nextUrl) ? nextUrl : null;
  } catch {
    return null;
  }
}

export async function fetchAllowedMedia(
  target,
  { headers = {}, range, timeoutMs = 20_000, maxRedirects = 3 } = {}
) {
  let currentUrl = target;
  let lastStatus = 0;

  for (let redirects = 0; redirects <= maxRedirects; redirects++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let resp;
    try {
      resp = await fetch(currentUrl, {
        headers: { ...headers, ...(range ? { Range: range } : {}) },
        redirect: 'manual',
        cache: 'no-store',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    lastStatus = resp.status;
    if (!REDIRECT_STATUSES.has(resp.status)) {
      return { response: resp, lastStatus };
    }

    const nextUrl = resolveAllowedRedirect(currentUrl, resp.headers.get('location'));
    if (!nextUrl) {
      return { response: null, lastStatus, blockedRedirect: true };
    }
    currentUrl = nextUrl;
  }

  return { response: null, lastStatus, tooManyRedirects: true };
}
