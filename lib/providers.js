/**
 * TikTok 解析层：多 Provider 容错
 * Provider 1: TikWM 公共 API（主力，返回无水印地址）
 * Provider 2: TikTok 页面内嵌 JSON 提取（备用，TikWM 失效时兜底）
 */

export { isAllowedMediaUrl } from './media-fetch.mjs';

const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';

const DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export const DOWNLOAD_HEADERS = {
  'User-Agent': DESKTOP_UA,
  Referer: 'https://www.tiktok.com/',
  'Accept-Language': 'en-US,en;q=0.9',
};

/** 校验是否为 TikTok 链接 */
export function isTikTokUrl(raw) {
  try {
    const u = new URL(String(raw).trim());
    if (!/^https?:$/.test(u.protocol)) return false;
    return /(^|\.)tiktok\.com$/i.test(u.hostname);
  } catch {
    return false;
  }
}

/** 短链（vt./vm./t/）→ 完整链接 */
export async function resolveShortLink(url) {
  try {
    const u = new URL(url);
    const isShort =
      /^(vm|vt)\.tiktok\.com$/i.test(u.hostname) || /^\/t\//i.test(u.pathname);
    if (!isShort) return url;

    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': MOBILE_UA },
    });
    if (res.url && /tiktok\.com/i.test(res.url) && !/^(vm|vt)\./i.test(new URL(res.url).hostname)) {
      return res.url;
    }
    // 部分短链通过 meta refresh / JS 跳转，从 HTML 中提取完整链接
    const html = await res.text();
    const m = html.match(/https:\/\/www\.tiktok\.com\/@[\w.\-]+\/(?:video|photo)\/\d+/);
    if (m) return m[0];
    return url;
  } catch {
    return url;
  }
}

function absTikwm(p) {
  if (!p) return null;
  return p.startsWith('http') ? p : `https://www.tikwm.com${p}`;
}

/** Provider 1: TikWM */
async function providerTikwm(url) {
  const res = await fetch(
    `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`,
    { headers: { 'User-Agent': DESKTOP_UA }, cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`tikwm HTTP ${res.status}`);
  const json = await res.json();
  if (json.code !== 0 || !json.data) throw new Error(json.msg || 'tikwm 解析失败');
  const d = json.data;

  const formats = [];
  if (d.hdplay)
    formats.push({ kind: 'hd_nowm', label: '高清无水印 · MP4', type: 'video', url: absTikwm(d.hdplay) });
  if (d.play)
    formats.push({ kind: 'nowm', label: '无水印 · MP4', type: 'video', url: absTikwm(d.play) });
  // 不提供带水印格式：对齐 SSSTik 的产品口径（用户要的就是无水印），
  // 且 tikwm 的 wmplay 缓存链接失效率最高
  if (formats.length === 0) throw new Error('tikwm 未返回可用格式');

  return {
    provider: 'tikwm',
    id: String(d.id || ''),
    title: d.title || '',
    cover: absTikwm(d.cover) || absTikwm(d.origin_cover),
    duration: Number(d.duration) || 0,
    author: {
      name: d.author?.nickname || '',
      uniqueId: d.author?.unique_id || '',
      avatar: absTikwm(d.author?.avatar),
    },
    formats,
  };
}

/** 从页面 HTML 中提取视频内嵌 JSON（新版 UNIVERSAL_DATA / 旧版 SIGI_STATE） */
function extractFromHtml(html) {
  let data = null;

  const uni = html.match(
    /id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
  );
  if (uni) {
    try {
      const j = JSON.parse(uni[1]);
      const detail = j.__DEFAULT_SCOPE__?.['webapp.video-detail'];
      const item = detail?.itemInfo?.itemStruct;
      if (item) data = item;
    } catch {
      /* ignore */
    }
  }

  if (!data) {
    const sigi = html.match(/id="SIGI_STATE"[^>]*>([\s\S]*?)<\/script>/);
    if (sigi) {
      try {
        const j = JSON.parse(sigi[1]);
        const first = Object.values(j.ItemModule || {})[0];
        if (first) data = first;
      } catch {
        /* ignore */
      }
    }
  }
  return data;
}

function buildPageResult(data) {
  const v = data.video || {};
  const formats = [];
  const playAddr = v.downloadAddr || v.playAddr;
  if (playAddr)
    formats.push({ kind: 'raw', label: 'MP4 视频（原始画质）', type: 'video', url: playAddr });
  if (formats.length === 0) return null;

  return {
    provider: 'page',
    id: String(data.id || ''),
    title: data.desc || '',
    cover: v.cover || v.dynamicCover || v.originCover || '',
    duration: Math.round((v.duration || 0) / 1000),
    author: {
      name: data.author?.nickname || '',
      uniqueId: data.author?.uniqueId || '',
      avatar: data.author?.avatarLarger || data.author?.avatarMedium || '',
    },
    formats,
  };
}

/**
 * Provider 2: TikTok 页面内嵌 JSON 提取。
 * 多 UA 组合抓取：普通桌面 UA 被 JS 验证页拦截时，
 * 搜索引擎爬虫 UA 有时能拿到完整 SSR 数据。
 */
const CRAWLER_UA =
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const PAGE_UAS = [DESKTOP_UA, CRAWLER_UA, MOBILE_UA];

async function providerPage(url) {
  let lastErr = '页面中未找到视频数据（可能触发了反爬）';
  for (const ua of PAGE_UAS) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': ua, 'Accept-Language': 'en-US,en;q=0.9' },
        cache: 'no-store',
      });
      if (!res.ok) {
        lastErr = `页面请求失败 HTTP ${res.status}`;
        continue;
      }
      const html = await res.text();
      const data = extractFromHtml(html);
      if (data) {
        const result = buildPageResult(data);
        if (result) return result;
      }
      lastErr = '页面中未找到视频数据（可能触发了反爬）';
    } catch (e) {
      lastErr = e?.message || String(e);
    }
  }
  throw new Error(lastErr);
}

/**
 * 统一入口：短链还原 → 依次尝试 Provider → 返回第一个成功的视频结果。
 * 返回 { result, errors: [{provider, message}] }
 */
export async function parseTikTok(rawUrl) {
  const url = await resolveShortLink(rawUrl);
  const providers = [
    { name: 'tikwm', fn: providerTikwm },
    { name: 'page', fn: providerPage },
  ];
  const errors = [];
  let result = null;

  for (const p of providers) {
    try {
      const r = await p.fn(url);
      if (!r) continue;
      result = r;
      break;
    } catch (e) {
      errors.push({ provider: p.name, message: e?.message || String(e) });
    }
  }
  return { result, errors };
}
