import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchPlatformMedia } from '../lib/platform-media.mjs';

test('canceling a proxied media body cancels upstream and aborts its request', async () => {
  let canceled = false;
  let upstreamSignal;
  const response = await fetchPlatformMedia('https://video.twimg.com/a.mp4', 'x', { fetchImpl: async (_url, options) => {
    upstreamSignal = options.signal;
    return new Response(new ReadableStream({ cancel() { canceled = true; } }));
  } });
  await response.body.cancel();
  assert.equal(canceled, true);
  assert.equal(upstreamSignal.aborted, true);
});

test('relative media redirects are followed with Range preserved', async () => {
  const calls = [];
  const response = await fetchPlatformMedia('https://video.twimg.com/a.mp4', 'x', { range: 'bytes=10-20',
    fetchImpl: async (url, options) => {
      calls.push({ url, range: options.headers.Range });
      return calls.length === 1 ? new Response(null, { status: 302, headers: { location: '/b.mp4' } }) : new Response('video');
    },
  });
  assert.equal(await response.text(), 'video');
  assert.deepEqual(calls, [{ url: 'https://video.twimg.com/a.mp4', range: 'bytes=10-20' }, { url: 'https://video.twimg.com/b.mp4', range: 'bytes=10-20' }]);
});
