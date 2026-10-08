import assert from 'node:assert/strict';
import test from 'node:test';
import { isPlatformMediaUrl, fetchPlatformMedia, attachmentHeader } from '../lib/platform-media.mjs';

test('platform media rejects credentials, ports, lookalike hosts and wrong platforms', () => {
  assert.equal(isPlatformMediaUrl('https://video.twimg.com/a.mp4', 'x'), true);
  assert.equal(isPlatformMediaUrl('https://finder.video.qq.com/a', 'weixin'), true);
  for (const url of ['http://video.twimg.com/a', 'https://video.twimg.com.evil.com/a',
    'https://user:pass@video.twimg.com/a', 'https://video.twimg.com:444/a',
    'https://127.0.0.1/a', 'https://finder.video.qq.com/a']) {
    assert.equal(isPlatformMediaUrl(url, 'x'), false, url);
  }
});

test('download redirects are validated before any second request', async () => {
  const calls = [];
  await assert.rejects(fetchPlatformMedia('https://video.twimg.com/a.mp4', 'x', {
    fetchImpl: async (url) => {
      calls.push(url);
      return new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/secret' } });
    },
  }), /跳转/);
  assert.equal(calls.length, 1);
});

test('filename strips controls and path characters, adds extension only once', () => {
  const header = attachmentHeader('中文/视频\r\n.mp4');
  assert.ok(!header.includes('\r') && !header.includes('\n'));
  assert.ok(!header.includes('.mp4.mp4'));
  assert.ok(header.includes("filename*=UTF-8''"));
});
