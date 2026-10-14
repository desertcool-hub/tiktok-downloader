import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { X_DICT } from '../lib/x-copy.mjs';
import { YOUTUBE_DICT } from '../lib/youtube-copy.mjs';
import { DICT } from '../lib/i18n.js';

const dictionaries = { TikTok: DICT, X: X_DICT, YouTube: YOUTUBE_DICT };
const sections = ['intro', 'why', 'howto', 'mobile', 'pc', 'faq'];
const kana = /[\p{Script=Hiragana}\p{Script=Katakana}]/u;
const japanese = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u;
const neutralStrings = new Set(['iPhone / iPad', 'Android', 'Chrome · Edge · Safari · Firefox']);

function assertSameShape(actual, expected, path) {
  assert.equal(typeof actual, typeof expected, `${path}: value type`);
  if (Array.isArray(expected)) {
    assert.ok(Array.isArray(actual), `${path}: array`);
    assert.equal(actual.length, expected.length, `${path}: array length`);
    expected.forEach((value, index) => assertSameShape(actual[index], value, `${path}[${index}]`));
  } else if (expected && typeof expected === 'object') {
    assert.deepEqual(Object.keys(actual).sort(), Object.keys(expected).sort(), `${path}: keys`);
    for (const key of Object.keys(expected)) assertSameShape(actual[key], expected[key], `${path}.${key}`);
  } else {
    assert.ok(actual.trim(), `${path}: nonempty copy`);
  }
}

function assertJapanese(value, path) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertJapanese(item, `${path}[${index}]`));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) assertJapanese(item, `${path}.${key}`);
  } else if (!neutralStrings.has(value)) {
    assert.match(value, japanese, `${path}: Japanese text, not English fallback`);
    if (value.includes('。')) assert.match(value, kana, `${path}: Japanese prose, not Chinese fallback`);
    assert.doesNotMatch(value, /\uFFFD/, `${path}: no replacement characters`);
  }
}

for (const [platform, dict] of Object.entries(dictionaries)) {
  test(`${platform} Japanese dictionary matches English keys and array shapes`, () => {
    assert.ok(dict.ja, 'self-contained Japanese dictionary');
    assert.equal(dict.ja.locale, 'ja');
    // X and YouTube do not yet have locale in English; Japanese explicitly declares it.
    const { locale: jaLocale, ...ja } = dict.ja;
    const { locale: enLocale, ...en } = dict.en;
    assertSameShape(ja, en, platform);
    assert.equal(dict.ja.why.items.length, 4);
    assert.equal(dict.ja.howto.steps.length, 4);
    assert.equal(dict.ja.faq.items.length, 9);
  });

  test(`${platform} critical copy, six content sections and nine FAQs are Japanese`, () => {
    const t = dict.ja;
    assert.ok(t);
    for (const section of ['nav', 'hero', 'loading', 'result', 'footer', ...sections]) {
      assertJapanese(t[section], `${platform}.${section}`);
    }
    if (t.formats) assertJapanese(t.formats, `${platform}.formats`);
    if (t.errors) assertJapanese(t.errors, `${platform}.errors`);
    assertJapanese(t.metaDesc, `${platform}.metaDesc`);
    if (t.metaTitle) assert.equal(t.metaTitle, platform === 'X' ? 'Free Online Video Downloader-X.com' : 'Free Online Video Downloader-youtube');
    if (t.keywords) {
      assert.equal(t.keywords[0], 'VidSaveNow');
      t.keywords.slice(1).forEach((keyword, index) => assertJapanese(keyword, `${platform}.keywords[${index + 1}]`));
    }
    for (const [index, [question, answer]] of t.faq.items.entries()) {
      assert.match(question, kana, `${platform} FAQ ${index + 1}: Japanese phrasing`);
      assert.match(answer, kana, `${platform} FAQ ${index + 1}: Japanese phrasing`);
      assert.match(question, /？$/, `${platform} FAQ ${index + 1}: Japanese question`);
      assert.match(answer, /。$/, `${platform} FAQ ${index + 1}: complete Japanese answer`);
      assert.notEqual(question, dict.en.faq.items[index][0]);
      assert.notEqual(answer, dict.en.faq.items[index][1]);
    }
  });
}

test('Japanese hero titles stay compact and legacy language links point to English', () => {
  assert.equal(DICT.ja.hero.h1, 'TikTok 動画ダウンロード');
  assert.equal(YOUTUBE_DICT.ja.hero.h1, 'YouTube 動画保存');
  assert.ok(X_DICT.ja.hero.h1.length <= 20);
  for (const [dict, href] of [[DICT, '/'], [X_DICT, '/x/en'], [YOUTUBE_DICT, '/youtube/en']]) {
    assert.deepEqual(dict.ja.altLocale, { href, label: 'English' });
  }
  assert.match(DICT.ja.metaDesc, /TikTok.*X\.com\s*\/\s*Twitter.*YouTube/);
  assert.match(DICT.ja.metaDesc, /専用.*ページ/);
});

test('Japanese YouTube copy preserves the 4 MB audio MP4 trial without inflated claims', () => {
  const t = YOUTUBE_DICT.ja;
  assert.ok(t);
  for (const value of [t.metaDesc, t.hero.sub, t.hero.trust, t.hero.stSuccess,
    t.result.primarySub, t.result.secondarySub, t.intro.p1, t.why.items[2][1],
    t.howto.steps[3][1], t.mobile.points[3], t.pc.points[3], t.pc.notes[0][1],
    ...t.faq.items.slice(0, 4).map(([, answer]) => answer),
    t.faq.items[6][1], t.faq.items[7][1], t.footer.disclaimer,
    t.errors.TOO_LARGE, t.errors.NO_VIDEO, t.errors.DOWNLOAD_FAILED]) {
    assert.match(value, /4 MB/);
  }
  for (const value of [t.hero.sub, t.hero.trust, t.loading.steps[1], t.intro.p1,
    t.why.items[1][1], t.howto.steps[3][1], t.mobile.points[2], t.pc.points[1],
    t.pc.notes[1][1], t.faq.items[6][1], t.errors.NO_VIDEO, t.errors.INVALID_MEDIA]) {
    assert.match(value, /音声/);
    assert.match(value, /MP4/);
  }
  assert.match(t.pc.points[3], /すべて.*ブラウザー/);
  assert.match(t.faq.items[8][1], /保証.*ません/);
  assert.doesNotMatch(JSON.stringify(t), /4K|MP3|unlimited|無制限|制限なし|上限なし|使い放題|256 MB/i);
});
