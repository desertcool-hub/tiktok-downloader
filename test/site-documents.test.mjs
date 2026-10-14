import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

test('trust pages have real contact details, localized copy and matching canonical URLs', async () => {
  assert.ok(existsSync('lib/site-documents.mjs'), 'Site document definitions are required');
  const { SITE_DOCUMENTS, SITE_CONTACT_EMAIL, documentPath, documentCopy, documentMetadata } = await import('../lib/site-documents.mjs');
  assert.equal(SITE_CONTACT_EMAIL, 'desertcool@gmail.com');
  assert.deepEqual(SITE_DOCUMENTS, ['privacy', 'terms', 'contact']);
  for (const document of SITE_DOCUMENTS) for (const locale of ['en', 'zh', 'ja']) {
    const path = `/${document}${locale === 'en' ? '' : `/${locale}`}`;
    assert.equal(documentPath(document, locale), path);
    const copy = documentCopy(document, locale);
    assert.ok(copy.title && copy.description && copy.sections.length >= 3);
    assert.ok(copy.sections.every(section => section.title && section.paragraphs.every(Boolean)));
    const metadata = documentMetadata(document, locale);
    assert.equal(metadata.title, `${copy.title} | VidSaveNow`);
    assert.equal(metadata.openGraph.title, metadata.title);
    assert.equal(metadata.twitter.title, metadata.title);
    assert.equal(metadata.alternates.canonical, path);
    assert.equal(metadata.alternates.languages.ja, `/${document}/ja`);
  }
  assert.throws(() => documentPath('unrelated', 'en'));
  const privacy = JSON.stringify(documentCopy('privacy', 'en'));
  for (const topic of ['Vercel', 'TikWM', 'FxEmbed', 'IP', 'logs']) assert.ok(privacy.includes(topic), topic);
  assert.doesNotMatch(privacy, /never collect|no data is collected/i);
  assert.match(privacy, /do not promise.*immediately deleted/);
});

test('all downloader footers share localized real document links', async () => {
  assert.ok(existsSync('components/FooterLinks.jsx'), 'Shared footer links are required');
  const footer = await readFile('components/FooterLinks.jsx', 'utf8');
  assert.match(footer, /documentPath/);
  assert.doesNotMatch(footer, /href="#"/);
  for (const file of ['components/HomeClient.jsx', 'components/XPageContent.jsx']) {
    const source = await readFile(file, 'utf8');
    assert.match(source, /<FooterLinks locale=\{locale\}/);
    assert.doesNotMatch(source, /href="#"/);
  }
  assert.match(await readFile('components/VideoPlatformClient.jsx', 'utf8'), /<XPageContent t=\{t\} locale=\{locale\}/);
});

test('trust pages are statically generated in all languages and included in the sitemap', async () => {
  for (const [group, route] of [['en', '[document]'], ['zh', '[document]/zh'], ['ja', '[document]/ja']]) {
    const file = `app/(${group})/${route}/page.js`;
    assert.ok(existsSync(file), file);
    const source = await readFile(file, 'utf8');
    assert.match(source, /generateStaticParams/);
    assert.match(source, /dynamicParams = false/);
    assert.match(source, /generateMetadata/);
  }
  const { default: sitemap } = await import('../app/sitemap.js');
  for (const document of ['privacy', 'terms', 'contact']) for (const locale of ['en', 'zh', 'ja']) {
    const path = `/${document}${locale === 'en' ? '' : `/${locale}`}`;
    assert.ok(sitemap().some(item => new URL(item.url).pathname === path), path);
  }
});

test('withdrawn platform downloaders are absent from source, deployment and sitemap', async () => {
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  assert.equal(config.functions['api/social.py'], undefined);
  for (const file of ['api/social.py', 'components/SocialClient.jsx', 'components/SocialPage.jsx',
    'lib/social-copy.mjs', 'lib/social-platforms.mjs', 'scripts/dev-social.mjs']) assert.equal(existsSync(file), false, file);
  const { default: sitemap } = await import('../app/sitemap.js');
  for (const platform of ['instagram', 'facebook', 'reddit', 'pinterest']) {
    for (const [group, suffix] of [['en', '/en'], ['zh', ''], ['ja', '/ja']]) {
      assert.equal(existsSync(`app/(${group})/${platform}${suffix}/page.js`), false);
    }
    assert.ok(!sitemap().some(item => new URL(item.url).pathname.startsWith('/' + platform)));
  }
});
