import assert from 'node:assert/strict';
import test from 'node:test';
import { parseTikTok } from '../lib/providers.js';

const post = 'https://www.tiktok.com/@example/video/123456';
const media = 'https://v16.tiktokcdn-us.com/video.mp4';

test('page fallback only returns a video when the download source accepts a range request', async (t) => {
  const itemStruct = { id: '123456', video: { downloadAddr: media } };
  const data = { __DEFAULT_SCOPE__: { 'webapp.video-detail': { itemInfo: { itemStruct } } } };
  let status = 403;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (String(url).startsWith('https://www.tikwm.com/')) return new Response(null, { status: 403 });
    if (url === post) {
      return new Response(`<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">${JSON.stringify(data)}</script>`);
    }
    assert.equal(url, media);
    assert.equal(options.headers.Range, 'bytes=0-1023');
    return new Response(null, { status, headers: { 'Content-Type': 'video/mp4' } });
  });

  const rejected = await parseTikTok(post);
  assert.equal(rejected.result, null);
  assert.match(rejected.errors[1].message, /403/);

  status = 206;
  const available = await parseTikTok(post);
  assert.equal(available.result.formats[0].url, media);
});
