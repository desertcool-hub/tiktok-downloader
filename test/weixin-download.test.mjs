import assert from 'node:assert/strict';
import test from 'node:test';
import { wxMediaResponse } from '../lib/weixin-download.mjs';
import { decryptWxBytes } from '../lib/weixin-decrypt.mjs';

const plain = Uint8Array.from([0, 0, 0, 24, 102, 116, 121, 112, 105, 115, 111, 109, 0, 0, 0, 0, ...Array(20).fill(22)]);
const url = 'https://finder.video.qq.com/video';
function upstream(bytes, contentType = 'application/octet-stream') {
  return async (_url, options) => {
    const probe = options.range === 'bytes=0-15';
    return new Response(probe ? bytes.slice(0, 16) : bytes, { status: probe ? 206 : 200,
      headers: { 'content-type': contentType, 'content-length': probe ? '16' : String(bytes.length),
        ...(probe ? { 'content-range': `bytes 0-15/${bytes.length}` } : {}) } });
  };
}

test('wechat octet-stream MP4 is recognized by bytes and downloaded as MP4', async () => {
  const response = await wxMediaResponse({ url, name: 'video', fetchMedia: upstream(plain) });
  assert.equal(response.headers.get('content-type'), 'video/mp4');
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), plain);
});

test('encrypted WeChat file is blocked without key and decrypted with the correct key', async () => {
  const bytes = decryptWxBytes(plain, '42');
  await assert.rejects(wxMediaResponse({ url, fetchMedia: upstream(bytes) }), e => e.code === 'KEY_REQUIRED');
  await assert.rejects(wxMediaResponse({ url, key: '43', fetchMedia: upstream(bytes) }), e => e.code === 'INVALID_KEY');
  const response = await wxMediaResponse({ url, key: '42', fetchMedia: upstream(bytes) });
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), plain);
});

test('Wechat probe reads split prefix chunks, reports total size, and leaves no body open', async () => {
  let canceled = false;
  const response = await wxMediaResponse({ url, probe: true, fetchMedia: async () => new Response(new ReadableStream({
    start(c) { c.enqueue(plain.slice(0, 3)); c.enqueue(plain.slice(3, 16)); },
    cancel() { canceled = true; },
  }), { status: 206, headers: { 'content-range': 'bytes 0-15/36' } }) });
  const result = await response.json();
  assert.equal(result.bytes, 36);
  assert.equal(result.encrypted, false);
  assert.equal(canceled, true);
});

test('HTML verification pages are not offered as video downloads', async () => {
  await assert.rejects(wxMediaResponse({ url, fetchMedia: upstream(new TextEncoder().encode('<html>blocked</html>'), 'text/html') }),
    e => e.code === 'NOT_VIDEO');
});

test('WeChat range downloads decrypt at the actual Content-Range offset', async () => {
  const bytes = decryptWxBytes(plain, '42');
  const response = await wxMediaResponse({ url, key: '42', range: 'bytes=7-', fetchMedia: async (_url, options) => {
    if (options.range === 'bytes=0-15') return new Response(bytes.slice(0, 16), {
      status: 206, headers: { 'content-range': 'bytes 0-15/36' },
    });
    return new Response(bytes.slice(7), { status: 206, headers: { 'content-range': 'bytes 7-35/36' } });
  } });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('content-range'), 'bytes 7-35/36');
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), plain.slice(7));
});
