const SEGMENT_SIZE = 4 * 1024 * 1024;
const MIN_SEGMENT_SIZE = 256 * 1024;

export async function fetchXDownload(url, options, { fetchImpl = fetch, segmentSize = SEGMENT_SIZE } = {}) {
  const { signal } = options;

  async function readRange(start, end, expectedTotal) {
    for (let attempt = 0; ; attempt++) {
      signal?.throwIfAborted();
      const deadline = AbortSignal.timeout(25_000);
      const requestSignal = signal ? AbortSignal.any([signal, deadline]) : deadline;
      const headers = new Headers(options.headers);
      headers.set('Range', `bytes=${start}-${end}`);
      try {
        const response = await fetchImpl(url, { ...options, headers, signal: requestSignal });
        const range = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(response.headers.get('Content-Range') || '');
        const total = Number(range?.[3]);
        if (response.status !== 206 || !response.headers.get('Content-Type')?.includes('video/mp4') ||
            !Number.isSafeInteger(total) || total <= end || Number(range?.[1]) !== start ||
            Number(range?.[2]) !== end || (expectedTotal !== undefined && total !== expectedTotal)) {
          await response.body?.cancel();
          throw Object.assign(new Error('下载源返回的视频分段无效，请重新解析后重试'), { status: response.status });
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.length !== end - start + 1) throw new Error('视频分段传输不完整，请重试');
        return { bytes, total };
      } catch (error) {
        signal?.throwIfAborted();
        if (attempt === 2 || (error.status >= 400 && error.status < 500)) throw error;
      }
    }
  }

  const { bytes, total } = await readRange(0, 0);
  let offset = 0;
  const body = new ReadableStream({
    async pull(controller) {
      const end = Math.min(offset + segmentSize, total) - 1;
      let segment;
      let nextEnd = end;
      while (!segment) {
        try {
          segment = total === 1 ? bytes : (await readRange(offset, nextEnd, total)).bytes;
        } catch (error) {
          const length = nextEnd - offset + 1;
          if (signal?.aborted || length <= MIN_SEGMENT_SIZE ||
              (error.status >= 400 && error.status < 500)) throw error;
          nextEnd = offset + Math.max(MIN_SEGMENT_SIZE, Math.floor(length / 2)) - 1;
        }
      }
      controller.enqueue(segment);
      offset += segment.length;
      if (offset === total) controller.close();
    },
  }, { highWaterMark: 0 });

  return new Response(body, { headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(total) } });
}
