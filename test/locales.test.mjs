import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Language routes preserve each platform with Japanese alternatives', async () => {
  const { platformPath, languageAlternates, htmlLanguage, openGraphLocales } = await import('../lib/locales.mjs');
  for (const [platform, paths] of Object.entries({ tiktok: ['/', '/zh', '/ja'], x: ['/x/en', '/x', '/x/ja'], youtube: ['/youtube/en', '/youtube', '/youtube/ja'] })) {
    for (const [index, locale] of ['en', 'zh', 'ja'].entries()) assert.equal(platformPath(platform, locale), paths[index]);
    const languages = languageAlternates(platform);
    assert.deepEqual({ en: languages.en, 'zh-CN': languages['zh-CN'], ja: languages.ja }, { en: paths[0], 'zh-CN': paths[1], ja: paths[2] });
  }
  assert.equal(htmlLanguage('ja'), 'ja');
  assert.equal(openGraphLocales('ja').locale, 'ja_JP');
  assert.deepEqual(openGraphLocales('ja').alternateLocale, ['en_US', 'zh_CN', 'id_ID', 'es_ES', 'pt_BR', 'vi_VN']);
});

test('Japanese routes and layout render platform-specific clients and FAQ schema', async () => {
  for (const [route, component, metadata, faq] of [['ja', 'HomeClient', 'tiktokMetadata', 'tiktokFaqJsonLd'],
    ['x/ja', 'XClient', 'xMetadata', 'xFaqJsonLd'], ['youtube/ja', 'YoutubeClient', 'youtubeMetadata', 'youtubeFaqJsonLd']]) {
    const page = await readFile(`app/(ja)/${route}/page.js`, 'utf8');
    assert.ok(page.includes(`${metadata}('ja')`));
    assert.ok(page.includes(`${faq}('ja')`));
    assert.ok(page.includes(`<${component} locale="ja"`));
  }
  const layout = await readFile('app/(ja)/layout.js', 'utf8');
  assert.match(layout, /<html lang="ja">/);
  assert.match(layout, /<Analytics\s*\/>/);
});

test('Default homepage stays a TikTok tool and metadata includes X and YouTube', async () => {
  const { tiktokMetadata } = await import('../lib/tiktok-seo.mjs');
  for (const locale of ['en', 'zh', 'ja']) {
    const meta = tiktokMetadata(locale);
    assert.equal(meta.title, 'TikTok Video Downloader Without Watermark | VidSaveNow');
    for (const brand of ['TikTok', 'X.com', 'YouTube']) {
      assert.ok(meta.description.includes(brand));
      assert.ok(meta.keywords.some(key => key.includes(brand) || key.includes(brand.toLowerCase())));
    }
    assert.equal(meta.twitter.description, meta.description);
    assert.equal(meta.openGraph.description, meta.description);
    assert.equal(meta.alternates.languages.ja, '/ja');
  }
  assert.match(await readFile('app/(en)/page.js', 'utf8'), /<HomeClient locale="en"/);
});

test('All languages use the requested platform titles and default site title', async () => {
  const { tiktokMetadata } = await import('../lib/tiktok-seo.mjs');
  const { xMetadata } = await import('../lib/x-copy.mjs');
  const { youtubeMetadata } = await import('../lib/youtube-copy.mjs');
  for (const locale of ['en', 'zh', 'ja']) {
    for (const [metadata, title] of [[tiktokMetadata, 'TikTok Video Downloader Without Watermark | VidSaveNow'],
      [xMetadata, 'Free Online Video Downloader-X.com'], [youtubeMetadata, 'Free Online Video Downloader-youtube']]) {
      const meta = metadata(locale);
      assert.equal(meta.title, title);
      assert.equal(meta.openGraph.title, title);
      assert.equal(meta.twitter.title, title);
    }
    assert.match(await readFile(`app/(${locale})/layout.js`, 'utf8'), /title: 'Free Online Video Downloader'/);
  }
});

test('Japanese X and YouTube metadata and sitemap include all language counterparts', async () => {
  const { xMetadata } = await import('../lib/x-copy.mjs');
  const { youtubeMetadata } = await import('../lib/youtube-copy.mjs');
  for (const [metadata, path] of [[xMetadata, '/x/ja'], [youtubeMetadata, '/youtube/ja']]) {
    const meta = metadata('ja');
    assert.equal(meta.alternates.canonical, path);
    assert.equal(meta.alternates.languages.ja, path);
    assert.equal(meta.openGraph.locale, 'ja_JP');
  }
  const { default: sitemap } = await import('../app/sitemap.js');
  for (const route of ['/ja', '/x/ja', '/youtube/ja']) {
    assert.ok(sitemap().some(entry => new URL(entry.url).pathname === route && entry.alternates.languages.ja.endsWith(route)));
  }
});
