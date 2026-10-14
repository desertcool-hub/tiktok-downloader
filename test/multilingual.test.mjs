import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { LOCALES, platformPath, languageAlternates, htmlLanguage } from '../lib/locales.mjs';
import { DICT } from '../lib/i18n.js';
import { X_DICT, xMetadata, xFaqJsonLd } from '../lib/x-copy.mjs';
import { YOUTUBE_DICT, youtubeMetadata, youtubeFaqJsonLd } from '../lib/youtube-copy.mjs';
import { tiktokMetadata, tiktokFaqJsonLd } from '../lib/tiktok-seo.mjs';
import { documentPath, documentCopy, documentMetadata } from '../lib/site-documents.mjs';
import { uiCopy, parseErrorMessage } from '../lib/ui-copy.mjs';

const added = ['id', 'es', 'pt', 'vi'];
function assertShape(base, translated, path = '') {
  assert.ok(translated !== undefined, `Missing ${path}`);
  if (typeof base === 'string') return assert.ok(typeof translated === 'string' && translated.trim(), path);
  if (Array.isArray(base)) assert.equal(translated.length, base.length, path);
  for (const key of Object.keys(base)) assertShape(base[key], translated[key], `${path}.${key}`);
}

test('new locales preserve legacy URLs and expose separate indexable paths', () => {
  assert.deepEqual(LOCALES.map(item => item.code), ['en', 'zh', 'ja', ...added]);
  for (const locale of added) {
    assert.equal(platformPath('tiktok', locale), `/${locale}`);
    for (const platform of ['x', 'youtube']) assert.equal(platformPath(platform, locale), `/${platform}/${locale}`);
    assert.equal(htmlLanguage(locale), locale === 'pt' ? 'pt-BR' : locale);
  }
  assert.equal(platformPath('tiktok', 'en'), '/');
  assert.equal(platformPath('x', 'zh'), '/x');
  assert.equal(platformPath('youtube', 'ja'), '/youtube/ja');
  assert.equal(languageAlternates('tiktok')['pt-BR'], '/pt');
});

for (const locale of added) test(`${locale} fully localizes downloader copy, metadata and FAQ`, () => {
  for (const [dictionary, metadata, faq, platform] of [[DICT, tiktokMetadata, tiktokFaqJsonLd, 'tiktok'],
    [X_DICT, xMetadata, xFaqJsonLd, 'x'], [YOUTUBE_DICT, youtubeMetadata, youtubeFaqJsonLd, 'youtube']]) {
    assertShape(dictionary.en, dictionary[locale], platform);
    const copy = dictionary[locale], meta = metadata(locale);
    assert.notEqual(copy.hero.h1, dictionary.en.hero.h1);
    assert.notEqual(copy.metaDesc, dictionary.en.metaDesc);
    assert.ok(meta.title.includes('VidSaveNow'));
    assert.equal(meta.openGraph.title, meta.title);
    assert.equal(meta.twitter.description, meta.description);
    if (platform === 'youtube') assert.equal(meta.openGraph.images[0].alt, meta.title);
    assert.equal(meta.alternates.canonical, platformPath(platform, locale));
    assert.equal(Object.keys(meta.alternates.languages).length, 7);
    assert.equal(faq(locale).mainEntity.length, 9);
    assert.equal(faq(locale).mainEntity[0].name, copy.faq.items[0][0]);
    assert.notEqual(copy.hero.stNetFail, dictionary.en.hero.stNetFail);
  }
  const youtube = YOUTUBE_DICT[locale];
  for (const text of [youtube.metaDesc, youtube.hero.sub, youtube.result.primarySub, youtube.footer.disclaimer, youtube.errors.TOO_LARGE]) assert.match(text, /4 MB/);
  for (const document of ['privacy', 'terms', 'contact']) {
    assert.equal(documentPath(document, locale), `/${document}/${locale}`);
    assert.notEqual(documentCopy(document, locale).title, documentCopy(document, 'en').title);
    assert.equal(documentMetadata(document, locale).alternates.canonical, `/${document}/${locale}`);
    assert.equal(Object.keys(documentMetadata(document, locale).alternates.languages).length, 7);
  }
  assert.notEqual(uiCopy(locale).rateLimited, uiCopy('en').rateLimited);
  assert.equal(parseErrorMessage(locale, undefined, 502, DICT[locale].hero.stFail, DICT[locale].hero.stInvalid, '中文服务错误'), DICT[locale].hero.stFail);
  assert.equal(parseErrorMessage(locale, undefined, 429, 'fallback'), uiCopy(locale).rateLimited);
  assert.equal(parseErrorMessage(locale, 'NO_VIDEO', 422, 'fallback'), uiCopy(locale).noVideo);
});

test('new root layouts and explicit language routes exist without reviving withdrawn platforms', async () => {
  for (const locale of added) {
    for (const route of [`app/(${locale})/${locale}/page.js`, `app/(${locale})/x/${locale}/page.js`,
      `app/(${locale})/youtube/${locale}/page.js`, `app/(${locale})/[document]/${locale}/page.js`, `app/(${locale})/layout.js`]) assert.ok(existsSync(route), route);
  }
  const { default: sitemap } = await import('../app/sitemap.js');
  const items = sitemap();
  for (const locale of added) for (const path of [`/${locale}`, `/x/${locale}`, `/youtube/${locale}`, `/privacy/${locale}`, `/terms/${locale}`, `/contact/${locale}`]) {
    const entry = items.find(item => new URL(item.url).pathname === path);
    assert.ok(entry, path);
    assert.equal(Object.keys(entry.alternates.languages).length, 7);
  }
  assert.equal(new Set(items.map(item => item.url)).size, items.length);
  assert.ok(!items.some(item => /\/(instagram|facebook|reddit|pinterest)(\/|$)/.test(item.url)));
  assert.doesNotMatch(await readFile('components/HomeClient.jsx', 'utf8'), /locale !== 'ja' \? json.error/);
});
