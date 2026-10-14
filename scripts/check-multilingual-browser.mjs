import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { LOCALES, platformPath } from '../lib/locales.mjs';
import { DICT } from '../lib/i18n.js';
import { X_DICT, xMetadata } from '../lib/x-copy.mjs';
import { YOUTUBE_DICT, youtubeMetadata } from '../lib/youtube-copy.mjs';
import { tiktokMetadata } from '../lib/tiktok-seo.mjs';
import { documentPath, documentCopy, documentMetadata } from '../lib/site-documents.mjs';
import { uiCopy } from '../lib/ui-copy.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.MULTILINGUAL_TEST_URL || 'http://localhost:3002';
const platforms = { tiktok: [DICT, tiktokMetadata], x: [X_DICT, xMetadata], youtube: [YOUTUBE_DICT, youtubeMetadata] };
const examples = {
  tiktok: 'https://www.tiktok.com/@qa/video/1234567890123456789',
  x: 'https://x.com/qa/status/1234567890123456789', youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const report = { environment: 'local built pages; interaction responses are synthetic, not live platform downloads', pages: [], interactions: [] };
await mkdir('.gstack/multilingual-qa', { recursive: true });

async function checkMetadata(page, meta, locale) {
  assert.equal(await page.title(), meta.title);
  assert.equal(await page.locator('html').getAttribute('lang'), locale.language);
  assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), meta.description);
  assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute('href')).pathname, meta.alternates.canonical);
  const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll(nodes => Object.fromEntries(nodes.map(node => [node.hreflang, new URL(node.href).pathname])));
  assert.deepEqual(alternates, meta.alternates.languages);
  assert.equal(await page.locator('select option').count(), 7);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(await page.locator('button, .cta-copy, h1').evaluateAll(nodes => nodes
    .filter(node => node.getBoundingClientRect().width && node.scrollWidth > node.clientWidth + 1)
    .map(node => node.textContent.trim())), [], 'visible control text fits');
}

try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] });
    await context.addInitScript(() => { window.showSaveFilePicker = undefined; });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const locale of LOCALES) {
      for (const [platform, [dictionary, metadata]] of Object.entries(platforms)) {
        const path = platformPath(platform, locale.code), copy = dictionary[locale.code];
        assert.equal((await page.goto(base + path)).status(), 200, path);
        await checkMetadata(page, metadata(locale.code), locale);
        assert.equal(await page.locator('h1').innerText(), copy.hero.h1);
        assert.equal(await page.locator('select').inputValue(), path);
        for (const other of ['tiktok', 'x', 'youtube']) assert.equal(await page.locator(`nav a[href="${platformPath(other, locale.code)}"]`).count(), 1);
        for (const [index, document] of ['privacy', 'terms', 'contact'].entries()) assert.equal(await page.locator('footer .footer-links a').nth(index).getAttribute('href'), documentPath(document, locale.code));
        const schema = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(text => JSON.parse(text));
        assert.equal(schema.find(item => item['@type'] === 'FAQPage').mainEntity.length, 9);
        assert.equal(schema.find(item => item['@type'] === 'WebSite').inLanguage.length, 7);
        await page.locator('input[type="url"]').fill('https://invalid.example/video');
        await page.locator('input[type="url"]').press('Enter');
        await page.getByRole('status').filter({ hasText: copy.hero.stInvalid }).waitFor();
        if (['id', 'es', 'pt', 'vi'].includes(locale.code) && platform === 'tiktok') await page.screenshot({ path: `.gstack/multilingual-qa/${locale.code}-${viewport.width}.png`, fullPage: true });
        report.pages.push({ path, width: viewport.width, status: 'passed' });
      }
      for (const document of ['privacy', 'terms', 'contact']) {
        const path = documentPath(document, locale.code);
        assert.equal((await page.goto(base + path)).status(), 200, path);
        await checkMetadata(page, documentMetadata(document, locale.code), locale);
        assert.equal(await page.locator('h1').innerText(), documentCopy(document, locale.code).title);
        assert.equal(await page.locator('a[href="mailto:desertcool@gmail.com"]').count(), 1);
        report.pages.push({ path, width: viewport.width, status: 'passed' });
      }
    }
    assert.deepEqual(errors, []);
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] });
  await context.addInitScript(() => { window.showSaveFilePicker = undefined; });
  const page = await context.newPage();
  for (const locale of ['id', 'es', 'pt', 'vi']) for (const [platform, [dictionary]] of Object.entries(platforms)) {
    const copy = dictionary[locale];
    let mode = 'error', downloadRequests = 0, kind = 'nowm';
    await page.route('**/api/*', async route => {
      if (route.request().method() === 'POST') {
        assert.equal(route.request().postDataJSON().url, examples[platform]);
        assert.ok(route.request().url().endsWith({ tiktok: '/api/parse', x: '/api/xparse', youtube: '/api/youtube' }[platform]));
        if (mode === 'error') return route.fulfill({ status: 429, json: { success: false, error: '中文服务器错误', code: 'RATE_LIMITED' } });
        const url = platform === 'youtube' ? '/api/youtube?token=multilingual.signature' : platform === 'x' ? 'https://video.twimg.com/qa/video.mp4' : 'https://v16m-default.tiktokcdn.com/qa/video.mp4';
        const video = { id: 'qa', title: 'QA video', author: { name: 'QA creator' }, duration: 5, cover: '', formats: [{ id: '18', kind, label: '360p', type: 'video', url }] };
        return route.fulfill({ json: platform === 'tiktok' ? { success: true, video } : { success: true, videos: [video] } });
      }
      downloadRequests++;
      return route.fulfill({ status: 200, contentType: 'video/mp4', headers: { 'content-disposition': 'attachment; filename="qa.mp4"' }, body: Buffer.from('synthetic download, not a live platform video') });
    });
    await page.goto(base + platformPath(platform, locale));
    await page.evaluate(url => navigator.clipboard.writeText(url), examples[platform]);
    await page.getByRole('button', { name: copy.hero.paste, exact: true }).click();
    await page.waitForFunction(url => document.querySelector('input[type="url"]').value === url, examples[platform]);
    await page.locator('input[type="url"]').press('Enter');
    const expected = platform === 'youtube' ? copy.errors.RATE_LIMITED : uiCopy(locale).rateLimited;
    await page.getByRole('status').filter({ hasText: expected }).waitFor();
    mode = 'success';
    await page.locator('input[type="url"]').fill(examples[platform]);
    await page.locator('input[type="url"]').press('Enter');
    await page.locator('.result').waitFor();
    assert.deepEqual(await page.locator('.result .cta-copy').evaluateAll(nodes => nodes
      .filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.textContent.trim())), [], `${platform}/${locale}: download labels fit`);
    const primary = page.locator('.result .cta').first();
    if (platform === 'tiktok') {
      // Native browser transfers bypass page request mocks; verify the unchanged link contract.
      const link = new URL(await primary.getAttribute('href'), base);
      assert.equal(link.pathname, '/api/download');
      assert.equal(link.searchParams.get('u'), 'https://v16m-default.tiktokcdn.com/qa/video.mp4');
      assert.ok((await primary.getAttribute('download')).endsWith('.mp4'));
      assert.equal(await primary.locator('.cta-sub').innerText(), copy.formats.nowm);
      assert.equal(await primary.locator('.cta-label').innerText(), copy.result.dl);
      for (const nextKind of ['raw', 'hd_nowm']) {
        kind = nextKind;
        await page.locator('input[type="url"]').fill(examples[platform]);
        await page.locator('input[type="url"]').press('Enter');
        await page.waitForFunction(text => document.querySelector('.result .cta-sub')?.textContent === text, copy.formats[kind]);
        assert.equal(await primary.locator('.cta-label').innerText(), kind === 'hd_nowm' ? copy.result.primaryCta : copy.result.dl);
      }
    } else {
      const saved = page.waitForEvent('download');
      await primary.click();
      const download = await saved;
      assert.equal(await download.failure(), null, `${platform}/${locale}: synthetic download`);
      assert.equal(downloadRequests, 1);
    }
    if (platform !== 'tiktok') {
      await page.getByRole('status').filter({ hasText: copy.result.saved }).waitFor();
      await page.evaluate(() => {
        window.originalFetch = window.fetch;
        window.fetch = (url, options) => {
          if (!String(url).startsWith('/api/')) return window.originalFetch(url, options);
          const body = new ReadableStream({ start(controller) {
            controller.enqueue(new Uint8Array(1024));
            options.signal.addEventListener('abort', () => controller.error(new DOMException('Canceled', 'AbortError')), { once: true });
          } });
          return Promise.resolve(new Response(body, { headers: { 'Content-Type': 'video/mp4', 'Content-Length': '4096' } }));
        };
      });
      await page.locator('.result .cta').first().click();
      await page.getByRole('button', { name: copy.result.cancel, exact: true }).click();
      await page.getByRole('button', { name: copy.result.cancel, exact: true }).waitFor({ state: 'hidden' });
      assert.equal(await page.locator('.result').getByRole('alert').count(), 0);
      await page.evaluate(() => { window.fetch = window.originalFetch; delete window.originalFetch; });
    }
    const next = { id: 'es', es: 'pt', pt: 'vi', vi: 'id' }[locale];
    await page.locator('select').selectOption(platformPath(platform, next));
    await page.waitForURL('**' + platformPath(platform, next));
    assert.equal(await page.locator('html').getAttribute('lang'), next === 'pt' ? 'pt-BR' : next);
    await page.locator(`nav a[href="${platformPath('x', next)}"]`).click();
    await page.waitForURL('**' + platformPath('x', next));
    report.interactions.push({ platform, locale, paste: 'passed', enter: 'passed', localizedError: 'passed', mockDownload: platform === 'tiktok' ? 'native link contract only; transfer not mocked' : 'passed', cancel: platform === 'tiktok' ? 'not present in existing TikTok UI' : 'passed', switchLanguageAndPlatform: 'passed' });
    await page.unrouteAll();
  }
  await context.close();
  for (const platform of ['instagram', 'facebook', 'reddit', 'pinterest']) assert.equal((await fetch(base + '/' + platform)).status, 404);
  const xml = await (await fetch(base + '/sitemap.xml')).text();
  assert.ok(!/instagram|facebook|reddit|pinterest/.test(xml));
  await writeFile('.gstack/multilingual-qa/report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ pages: report.pages.length, interactions: report.interactions.length, status: 'passed' }));
} finally { await browser.close(); }
