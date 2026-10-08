'use client';

import { useEffect, useRef, useState } from 'react';

export function saveVideoBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export function videoFilename(video, index = 0) {
  const base = `${video.author?.name || 'video'}-${video.title || 'video'}${index ? `-${index + 1}` : ''}`
    .replace(/[\u0000-\u001f\u007f\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90);
  return `${base || 'video'}.mp4`;
}

export default function useVideoDownload({ maxBytes = 256 * 1024 * 1024 } = {}) {
  const [state, setState] = useState({ phase: 'idle', bytes: 0, total: 0, error: '' });
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function download(url, options, name) {
    if (controller.current) return;
    const abort = new AbortController();
    controller.current = abort;
    let writer;
    setState({ phase: 'loading', bytes: 0, total: 0, error: '' });
    try {
      // Chromium can save directly to disk instead of buffering a large video.
      if (typeof window.showSaveFilePicker === 'function') {
        const handle = await window.showSaveFilePicker({ suggestedName: name,
          types: [{ description: 'MP4 Video', accept: { 'video/mp4': ['.mp4'] } }] });
        writer = await handle.createWritable();
      }
      if (abort.signal.aborted) throw new DOMException('Canceled', 'AbortError');
      const response = await fetch(url, { ...options, signal: abort.signal });
      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw Object.assign(new Error(json?.error || '下载失败，请重新获取链接后重试'), { code: json?.code, status: response.status });
      }
      if (!response.headers.get('content-type')?.includes('video/mp4') || !response.body) throw Object.assign(new Error('下载源没有返回 MP4 视频'), { code: 'INVALID_MEDIA' });
      const total = Number(response.headers.get('content-length') || 0);
      const bufferLimit = maxBytes;
      if ((!writer || maxBytes < 256 * 1024 * 1024) && total > bufferLimit) {
        abort.abort();
        throw Object.assign(new Error('该视频较大，请使用电脑 Chrome 或 Edge 下载，或用桌面下载助手保存'), { code: 'FILE_TOO_LARGE' });
      }
      const reader = response.body.getReader();
      const chunks = [];
      let bytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.length;
        if ((!writer || maxBytes < 256 * 1024 * 1024) && bytes > bufferLimit) { abort.abort(); throw Object.assign(new Error('视频超过浏览器内存下载上限，请使用电脑 Chrome 或 Edge'), { code: 'FILE_TOO_LARGE' }); }
        if (writer) await writer.write(value); else chunks.push(value);
        setState({ phase: 'loading', bytes, total, error: '' });
      }
      if (writer) await writer.close(); else saveVideoBlob(new Blob(chunks, { type: 'video/mp4' }), name);
      setState({ phase: 'done', bytes, total, error: '' });
    } catch (e) {
      if (writer) await writer.abort().catch(() => {});
      setState({ phase: e.name === 'AbortError' ? 'idle' : 'error', bytes: 0, total: 0,
        error: e.name === 'AbortError' ? '' : e.message || '下载失败，请重试', errorCode: e.code, errorStatus: e.status });
    } finally { controller.current = null; }
  }

  return { state, download, cancel: () => controller.current?.abort() };
}
