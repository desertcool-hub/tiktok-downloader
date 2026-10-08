import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as youtubeCopy from '../lib/youtube-copy.mjs';
import * as youtubeUrl from '../lib/youtube-url.mjs';
import * as youtubeMedia from '../components/youtube-media.mjs';
import * as xCopy from '../lib/x-copy.mjs';
import { YOUTUBE_DICT, youtubeMetadata, youtubeFaqJsonLd, youtubeErrorMessage } from '../lib/youtube-copy.mjs';
import { parseYoutubeUrl, looksLikeYoutube } from '../lib/youtube-url.mjs';
import { youtubeDownloadUrl, youtubeCoverUrl } from '../components/youtube-media.mjs';

const id = 'BaW_jenozKc';
const canonical = `https://www.youtube.com/watch?v=${id}`;

test('YouTube URLs normalize allowed hosts and video paths to a canonical watch link', () => {
  const urls = [` https://youtu.be/${id}?si=share#t=10 `];
  for (const host of ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com']) {
    urls.push(`https://${host}/watch?v=${id}&list=playlist&t=10`);
    for (const path of ['shorts', 'embed', 'live']) urls.push(`https://${host}/${path}/${id}/?feature=share`);
  }
  for (const raw of urls) {
    assert.deepEqual(parseYoutubeUrl(raw), { id, url: canonical });
    assert.equal(looksLikeYoutube(raw), true);
  }
});

test('YouTube URLs reject lookalike hosts, credentials, ambiguous IDs and non-video paths', () => {
  for (const raw of ['', null, {}, `http://youtube.com/watch?v=${id}`, `https://youtube.com.evil.test/watch?v=${id}`,
    `https://youtube.com@evil.test/watch?v=${id}`, `https://user:pass@youtube.com/watch?v=${id}`,
    `https://youtube.com:8443/watch?v=${id}`, `https://studio.youtube.com/watch?v=${id}`,
    `https://www.youtu.be/${id}`, `https://youtube.com/watch?v=${id}&v=${id}`, 'https://youtube.com/watch?v=short',
    `https://youtu.be/${id}/extra`, `https://youtube.com/embed/${id}extra`, 'https://youtube.com/playlist?list=abc',
    'https://youtube.com/@creator', 'file:///etc/passwd', 'javascript:alert(1)']) {
    assert.throws(() => parseYoutubeUrl(raw), { code: 'INVALID_URL' });
    assert.equal(looksLikeYoutube(raw), false);
  }
});

test('YouTube download URLs retain the exact token while adding a safe filename parameter', () => {
  const token = 'signed+/token=with&delimiters';
  const name = '作者 & title?#.mp4';
  const result = youtubeDownloadUrl(`/api/youtube?token=${encodeURIComponent(token)}&name=old.mp4`, name);
  const parsed = new URL(result, 'https://www.vidsavenow.com');
  assert.equal(parsed.pathname, '/api/youtube');
  assert.equal(parsed.searchParams.get('token'), token);
  assert.deepEqual(parsed.searchParams.getAll('name'), [name]);
  assert.equal(parsed.searchParams.size, 2);
  assert.equal(parsed.hash, '');
});

test('YouTube result links reject arbitrary source URLs and malformed signed endpoints', () => {
  for (const raw of ['https://cdn.example/video.mp4', 'https://www.vidsavenow.com/api/youtube?token=valid',
    '//evil.test/api/youtube?token=valid', '/api/xdownload?token=valid', '/api/youtube/other?token=valid',
    '/api/youtube?token=', '/api/youtube?token=one&token=two', '/api/youtube?u=https://cdn.example/video.mp4',
    '/api/youtube?token=one&u=https://cdn.example/video.mp4',
    '/api/youtube?token=one#other', '/api/youtube?token=one\\other', undefined]) {
    assert.equal(youtubeDownloadUrl(raw, 'video.mp4'), null);
  }
});

test('YouTube cover URLs use only the direct YouTube thumbnail host', () => {
  const cover = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  assert.equal(youtubeCoverUrl(cover), cover);
  for (const raw of [undefined, '', `http://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    `https://i.ytimg.com.evil.test/vi/${id}/hqdefault.jpg`, `https://user@i.ytimg.com/vi/${id}/hqdefault.jpg`,
    'https://cdn.example/cover.jpg']) assert.equal(youtubeCoverUrl(raw), null);
});

for (const locale of ['zh', 'en']) {
  test(`YouTube ${locale} metadata and six SEO sections match the FAQ schema`, () => {
    const t = YOUTUBE_DICT[locale];
    const meta = youtubeMetadata(locale);
    assert.match(meta.title, /YouTube/);
    assert.equal(meta.description, t.metaDesc);
    assert.deepEqual(meta.alternates.languages, { en: '/youtube/en', 'zh-CN': '/youtube' });
    assert.equal(meta.alternates.canonical, locale === 'zh' ? '/youtube' : '/youtube/en');
    assert.equal(meta.openGraph.url, meta.alternates.canonical);
    assert.equal(meta.openGraph.images[0].url, '/youtube/social-image');
    assert.deepEqual(meta.twitter.images, ['/youtube/social-image']);
    assert.equal(meta.twitter.card, 'summary_large_image');
    assert.equal(meta.authors[0].name, 'VidSaveNow');
    assert.ok(t.keywords.length >= 8);
    for (const section of ['intro', 'why', 'howto', 'mobile', 'pc', 'faq']) assert.ok(t[section].h2);
    assert.equal(t.why.items.length, 4);
    assert.equal(t.howto.steps.length, 4);
    const schema = youtubeFaqJsonLd(locale);
    assert.equal(schema['@type'], 'FAQPage');
    assert.deepEqual(schema.mainEntity.map(q => [q.name, q.acceptedAnswer.text]), t.faq.items);
    assert.match(t.metaDesc, /4 MB/);
    assert.match(t.hero.sub, /4 MB/);
    assert.match(t.result.primarySub, /4 MB/);
    assert.match(JSON.stringify(t.pc), /4 MB/);
    assert.doesNotMatch(JSON.stringify(t), /X \/ Twitter|TikTok|MP3|4K|unlimited|不限|256 MB|large files|大文件/i);
  });

  test(`YouTube ${locale} errors cover the Vercel contract and download limits`, () => {
    const t = YOUTUBE_DICT[locale];
    for (const code of ['TOO_LARGE', 'YOUTUBE_BLOCKED', 'VIDEO_UNAVAILABLE', 'TOKEN_EXPIRED', 'NO_VIDEO',
      'PARSE_TIMEOUT', 'DOWNLOAD_TIMEOUT', 'YOUTUBE_NOT_CONFIGURED', 'RATE_LIMITED']) {
      assert.ok(t.errors[code]);
      assert.equal(youtubeErrorMessage(locale, code), t.errors[code]);
    }
    assert.equal(youtubeErrorMessage(locale, undefined, 429), t.errors.RATE_LIMITED);
    assert.equal(youtubeErrorMessage(locale, undefined, 413), t.errors.TOO_LARGE);
    assert.equal(youtubeErrorMessage(locale, undefined, 410), t.errors.TOKEN_EXPIRED);
    assert.equal(youtubeErrorMessage(locale, 'FILE_TOO_LARGE'), t.errors.TOO_LARGE);
    assert.equal(youtubeErrorMessage(locale, 'INVALID_TOKEN'), t.errors.TOKEN_EXPIRED);
    assert.equal(youtubeErrorMessage(locale, 'UNKNOWN'), t.hero.stFail);
    assert.equal(youtubeErrorMessage(locale, 'UNKNOWN', 500, 'DOWNLOAD_FAILED'), t.errors.DOWNLOAD_FAILED);
    assert.doesNotMatch(youtubeErrorMessage(locale, 'DOWNLOAD_FAILED'), /256|Chrome|Edge/);
    if (locale === 'en') assert.doesNotMatch(JSON.stringify(t.errors), /[\u4e00-\u9fff]/);
  });
}

test('YouTube routes, navigation and client connect to the shared frontend with a 60-second timeout', async () => {
  const source = path => readFile(new URL(path, import.meta.url), 'utf8');
  const files = await Promise.all([
    source('../app/(zh)/youtube/page.js'), source('../app/(en)/youtube/en/page.js'),
    source('../components/YoutubeClient.jsx'), source('../components/PlatformNavigation.jsx'),
    source('../components/PlatformNavigation.module.css'), source('../app/sitemap.js'),
  ]);
  for (const [index, locale] of ['zh', 'en'].entries()) {
    assert.ok(files[index].includes(`youtubeMetadata('${locale}')`));
    assert.ok(files[index].includes(`youtubeFaqJsonLd('${locale}')`));
    assert.ok(files[index].includes(`locale="${locale}"`));
  }
  assert.match(files[2], /endpoint="\/api\/youtube"/);
  assert.match(files[2], /timeoutMs=\{60_000\}/);
  assert.match(files[3], /zh \? '\/youtube' : '\/youtube\/en'/);
  assert.match(files[4], /overflow-x: auto/);
  assert.match(files[4], /\.language \{ flex-shrink: 0/);
  assert.ok(files[5].includes('`${SITE_URL}/youtube`'));
  assert.ok(files[5].includes('`${SITE_URL}/youtube/en`'));
});

test('The local YouTube proxy allows the Python deadline without changing production rewrites', async () => {
  const original = { NODE_ENV: process.env.NODE_ENV, YOUTUBE_DEV_PORT: process.env.YOUTUBE_DEV_PORT };
  try {
    process.env.NODE_ENV = 'development';
    process.env.YOUTUBE_DEV_PORT = '8061';
    const dev = (await import('../next.config.mjs?youtube-dev-test')).default;
    assert.ok(dev.experimental.proxyTimeout > 180_000);
    assert.deepEqual(await dev.rewrites(), [{ source: '/api/youtube', destination: 'http://127.0.0.1:8061/api/youtube' }]);
    process.env.NODE_ENV = 'production';
    const prod = (await import('../next.config.mjs?youtube-production-test')).default;
    assert.equal(prod.experimental.proxyTimeout, 120_000);
    assert.deepEqual(await prod.rewrites(), []);
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test('Shared JSX renders YouTube pages and signed result links while keeping X proxy downloads', async () => {
  // Compile components in memory to verify their rendered output without a Next build or server.
  const require = createRequire(import.meta.url);
  const swc = require('next/dist/build/swc');
  await swc.loadBindings();
  const root = fileURLToPath(new URL('..', import.meta.url));
  const modules = new Map([
    [path.join(root, 'lib/youtube-copy.mjs'), youtubeCopy],
    [path.join(root, 'lib/youtube-url.mjs'), youtubeUrl],
    [path.join(root, 'lib/x-copy.mjs'), xCopy],
    [path.join(root, 'components/youtube-media.mjs'), youtubeMedia],
  ]);
  function load(filename) {
    if (modules.has(filename)) return modules.get(filename);
    if (filename.endsWith('.css')) return { default: new Proxy({}, { get: (_, key) => String(key) }), __esModule: true };
    const source = readFileSync(filename, 'utf8');
    const { code } = swc.transformSync(source, {
      filename, jsc: { parser: { syntax: 'ecmascript', jsx: true }, target: 'es2022', transform: { react: { runtime: 'automatic' } } },
      module: { type: 'commonjs' },
    });
    const module = { exports: {} };
    modules.set(filename, module.exports);
    const localRequire = spec => {
      if (!spec.startsWith('.') && !spec.startsWith('@/')) return require(spec);
      let target = spec.startsWith('@/') ? path.join(root, spec.slice(2)) : path.resolve(path.dirname(filename), spec);
      if (!path.extname(target)) target += target.endsWith('/useVideoDownload') ? '.js' : '.jsx';
      return load(target);
    };
    new Function('module', 'exports', 'require', code)(module, module.exports, localRequire);
    return module.exports;
  }
  const Result = load(path.join(root, 'components/XVideoResult.jsx')).default;
  const video = { id, title: 'Example & title', author: { name: 'Creator' }, duration: 61,
    cover: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, formats: [
      { id: '18', label: '360p', url: '/api/youtube?token=signature' },
      { id: 'bad', label: 'Invalid', url: 'https://cdn.example/video.mp4' },
    ] };
  const youtubeHtml = renderToStaticMarkup(React.createElement(Result, { video, index: 0, t: YOUTUBE_DICT.en, locale: 'en', platform: 'youtube' }));
  assert.ok(youtubeHtml.includes(`src="https://i.ytimg.com/vi/${id}/hqdefault.jpg"`));
  assert.ok(youtubeHtml.includes('href="/api/youtube?token=signature&amp;name=Creator-Example+%26+title.mp4"'));
  assert.ok(youtubeHtml.includes('4 MB'));
  assert.ok(youtubeHtml.includes('1:01'));
  assert.doesNotMatch(youtubeHtml, /xdownload|cdn\.example|Invalid/);
  const xVideo = { ...video, cover: 'https://pbs.twimg.com/cover.jpg', formats: [{ label: '720p', url: 'https://video.twimg.com/video.mp4' }] };
  const xHtml = renderToStaticMarkup(React.createElement(Result, { video: xVideo, index: 0, t: xCopy.X_DICT.en, locale: 'en' }));
  assert.ok(xHtml.includes('/api/xdownload?u=https%3A%2F%2Fpbs.twimg.com%2Fcover.jpg&amp;inline=1'));
  assert.ok(xHtml.includes('/api/xdownload?u=https%3A%2F%2Fvideo.twimg.com%2Fvideo.mp4&amp;name='));
  assert.ok(xHtml.includes(xCopy.X_DICT.en.result.primaryCta));
  for (const [locale, file] of [['zh', 'app/(zh)/youtube/page.js'], ['en', 'app/(en)/youtube/en/page.js']]) {
    const Page = load(path.join(root, file)).default;
    const html = renderToStaticMarkup(React.createElement(Page));
    assert.ok(html.includes(`<h1>${YOUTUBE_DICT[locale].hero.h1}</h1>`));
    for (const section of ['about', 'why', 'howto', 'mobile', 'pc', 'faq']) assert.ok(html.includes(`id="${section}"`));
    assert.ok(html.includes(`href="${YOUTUBE_DICT[locale].altLocale.href}"`));
    assert.ok(html.includes('aria-current="page">YouTube</a>'));
    const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
    assert.deepEqual(JSON.parse(json), youtubeFaqJsonLd(locale));
  }
});
