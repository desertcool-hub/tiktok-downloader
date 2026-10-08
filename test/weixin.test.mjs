import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { normalizeWxRecord, importWxRecords, isWxShareUrl, resolveWxShare } from '../lib/weixin.mjs';
import { generateWxKeystream, decryptWxBytes, validateWxKey, decryptWxStream } from '../lib/weixin-decrypt.mjs';

test('wechat records preserve string keys, join tokens, and accept wx_channel exports', () => {
  const record = normalizeWxRecord({ videoUrl: 'https://finder.video.qq.com/download',
    decryptKey: '18446744073709551615', title: '测试', author: '作者' });
  assert.equal(record.key, '18446744073709551615');
  assert.equal(record.author.name, '作者');
  const feed = normalizeWxRecord({ objectDesc: { description: '描述', media: [{
    url: 'https://finder.video.qq.com/download?encfilekey=a', urlToken: '&token=b', decodeKey: '42',
  }] } });
  assert.equal(feed.url, 'https://finder.video.qq.com/download?encfilekey=a&token=b');
  assert.throws(() => normalizeWxRecord({ videoUrl: record.url, decryptKey: 18446744073709551615 }), /精度/);
});

test('wechat import deduplicates records and rejects unsafe media', () => {
  const url = 'https://finder.video.qq.com/download';
  const records = importWxRecords(JSON.stringify([{ videoUrl: url }, { videoUrl: url, decryptKey: '42' }]));
  assert.equal(records.length, 1);
  assert.equal(records[0].key, '42');
  assert.throws(() => importWxRecords('[{"url":"http://127.0.0.1/admin"}]'), /地址/);
  assert.equal(isWxShareUrl('https://weixin.qq.com/sph/abc'), true);
  assert.equal(isWxShareUrl('https://weixin.qq.com.evil/sph/abc'), false);
});

test('wx_channel share adapter posts the documented request and keeps key', async () => {
  const result = await resolveWxShare('https://weixin.qq.com/sph/abc', {
    channelUrl: 'http://localhost:2025', channelToken: 'private-token',
    fetchImpl: async (url, init) => {
      assert.equal(url, 'http://localhost:2025/api/channels/share/resolve');
      assert.equal(init.headers.Authorization, 'Bearer private-token');
      assert.deepEqual(JSON.parse(init.body), { urls: ['https://weixin.qq.com/sph/abc'] });
      return Response.json({ code: 0, data: { resolved: [{
        url: 'https://finder.video.qq.com/a', key: '42', authorName: '作者', title: '视频',
      }], failed: [] } });
    },
  });
  assert.equal(result.key, '42');
  assert.equal(result.author.name, '作者');
});

test('missing backend and no ready WeChat page have distinct actionable errors', async () => {
  await assert.rejects(resolveWxShare('https://weixin.qq.com/sph/abc'), e => e.code === 'SHARE_UNAVAILABLE');
  await assert.rejects(resolveWxShare('https://weixin.qq.com/sph/abc', {
    channelUrl: 'http://localhost:2025', fetchImpl: async () => Response.json({ code: 0,
      data: { resolved: [], failed: [{ errorCode: 'no_ready_client', error: 'internal detail' }] } }),
  }), e => e.code === 'WECHAT_OFFLINE' && !e.message.includes('internal detail'));
});

test('wechat key validation retains all 64 bits', () => {
  assert.equal(validateWxKey('18446744073709551615'), '18446744073709551615');
  for (const key of ['-1', '18446744073709551616', '1e10', 'xyz']) assert.throws(() => validateWxKey(key));
});

test('ISAAC64 output matches the WeChat 1.3.0 WASM decoder for two independent seeds', () => {
  // Captured from WxIsaac64.generate(131072), reversing the WASM output as wx_channel does.
  assert.equal(Buffer.from(generateWxKeystream('42', 32)).toString('hex'),
    'bbd61fa5105a596a9b3cc89c4acb57baf2469ccfa2bc2790c84d04a408160c5d');
  assert.equal(Buffer.from(generateWxKeystream('18446744073709551615', 32)).toString('hex'),
    '7c38fd3a2e7cd8ad64081892c82430f3a8eca8122a6f4607f6943b85ac39b6f0');
  assert.equal(createHash('sha256').update(generateWxKeystream('42')).digest('hex'),
    '6684f1c8b8bc473ce2156c9ca6e1cbb724e5ca7e9c6f6214ab3103f7e8d6a51e');
  assert.equal(createHash('sha256').update(generateWxKeystream('18446744073709551615')).digest('hex'),
    '5afbffd76305e81467f97c6370fa07916e9b197611bf5c357a854eb92a6354a1');
});

test('wechat decryption is independent of stream chunks and honors the 128 KiB boundary', async () => {
  const plain = new Uint8Array(131090).fill(17);
  const encrypted = decryptWxBytes(plain, '42');
  assert.deepEqual(encrypted.slice(131072), plain.slice(131072));
  assert.deepEqual(decryptWxBytes(encrypted, '42'), plain);
  const stream = new ReadableStream({ start(c) {
    c.enqueue(encrypted.slice(0, 3)); c.enqueue(encrypted.slice(3, 888));
    c.enqueue(encrypted.slice(888)); c.close();
  } });
  assert.deepEqual(new Uint8Array(await new Response(decryptWxStream(stream, '42')).arrayBuffer()), plain);
  assert.deepEqual(decryptWxBytes(encrypted.slice(37, 2048), '42', 37), plain.slice(37, 2048));
  assert.equal(generateWxKeystream('42', 16).length, 16);
});
