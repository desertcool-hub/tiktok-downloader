import test from 'node:test';
import assert from 'node:assert/strict';
import { X_DICT, xMetadata, xFaqJsonLd, looksLikeX } from '../lib/x-copy.mjs';

test('X validates public status links without accepting lookalike hosts', () => {
  assert.equal(looksLikeX('https://x.com/goldenfanship/status/2107860213495713984/video/1'), true);
  assert.equal(looksLikeX('https://twitter.com/user/status/12345?s=20'), true);
  for (const url of ['', 'https://x.com/user', 'https://x.com.evil.test/u/status/12345', 'http://x.com/u/status/12345']) {
    assert.equal(looksLikeX(url), false);
  }
});

for (const locale of ['zh', 'en', 'ja']) {
  test(`${locale} X SEO covers the same sections and metadata as TikTok`, () => {
    const t = X_DICT[locale];
    const meta = xMetadata(locale);
    assert.equal(meta.description, t.metaDesc);
    assert.equal(meta.title, 'Free Online Video Downloader-X.com');
    assert.deepEqual(meta.alternates.languages, { en: '/x/en', 'zh-CN': '/x', ja: '/x/ja',
      id: '/x/id', es: '/x/es', 'pt-BR': '/x/pt', vi: '/x/vi' });
    assert.equal(meta.alternates.canonical, { zh: '/x', en: '/x/en', ja: '/x/ja' }[locale]);
    assert.equal(meta.openGraph.url, meta.alternates.canonical);
    assert.equal(meta.twitter.card, 'summary_large_image');
    assert.equal(meta.openGraph.images[0].url, '/x/social-image');
    assert.deepEqual(meta.twitter.images, ['/x/social-image']);
    assert.equal(meta.authors[0].name, 'VidSaveNow');
    assert.ok(meta.keywords.length >= 8);
    for (const section of ['intro', 'why', 'howto', 'mobile', 'pc', 'faq']) assert.ok(t[section].h2);
    assert.equal(t.why.items.length, 4);
    assert.equal(t.howto.steps.length, 4);
    assert.equal(xFaqJsonLd(locale).mainEntity.length, t.faq.items.length);
    assert.deepEqual(xFaqJsonLd(locale).mainEntity.map(q => [q.name, q.acceptedAnswer.text]), t.faq.items);
    assert.doesNotMatch(JSON.stringify(t), /TikTok|MP3|1080p|无水印|watermark/i);
  });
}
