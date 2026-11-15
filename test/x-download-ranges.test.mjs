import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchXDownload } from '../components/x-download-ranges.mjs';

test('X downloads retry truncated ranges without appending partial data', async () => {
  const data = Uint8Array.of(1, 2, 3, 4, 5, 6);
  const calls = [];
  const result = await fetchXDownload('/api/xdownload', {}, {
    segmentSize: 4,
    fetchImpl: async (_url, { headers }) => {
      const range = headers.get('range');
      calls.push(range);
      const [, start, askedEnd] = /^bytes=(\d+)-(\d+)$/.exec(range).map(Number);
      const end = Math.min(askedEnd, data.length - 1);
      const length = range === 'bytes=0-3' && calls.length === 2 ? 2 : end - start + 1;
      return new Response(data.slice(start, start + length), {
        status: 206,
        headers: { 'Content-Range': `bytes ${start}-${end}/${data.length}`, 'Content-Type': 'video/mp4' },
      });
    },
  });
  assert.equal(result.headers.get('content-length'), '6');
  assert.deepEqual(new Uint8Array(await result.arrayBuffer()), data);
  assert.deepEqual(calls, ['bytes=0-0', 'bytes=0-3', 'bytes=0-3', 'bytes=4-5']);
});
