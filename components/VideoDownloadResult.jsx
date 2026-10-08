'use client';

import { useState } from 'react';
import { Download, Film, LoaderCircle, X, CircleCheck, AlertCircle } from 'lucide-react';
import useVideoDownload, { videoFilename } from './useVideoDownload';
import styles from './DownloadTools.module.css';

export function formatBytes(bytes) { return bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : ''; }

export default function VideoDownloadResult({ video, platform, index }) {
  const [selected, setSelected] = useState(0);
  const { state, download, cancel } = useVideoDownload();
  const format = video.formats[selected];
  const busy = state.phase === 'loading';
  const endpoint = platform === 'x' ? '/api/xdownload' : '/api/wxdownload';
  function handleDownload() {
    const name = videoFilename(video, index);
    if (platform === 'weixin') download(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: format.url, key: video.key, name }) }, name);
    else download(`${endpoint}?u=${encodeURIComponent(format.url)}&name=${encodeURIComponent(name)}`, {}, name);
  }
  return (
    <article className={styles.video}>
      {video.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.cover} src={`${endpoint}?u=${encodeURIComponent(video.cover)}&inline=1`} alt="视频封面" loading="lazy" />
      ) : <div className={`${styles.cover} ${styles.placeholder}`} aria-hidden="true"><Film size={30} /></div>}
      <div className={styles.videoInfo}>
        <h3 className={styles.videoTitle}>{video.title || '未命名视频'}</h3>
        <div className={styles.meta}>
          {video.author?.name && <span>{video.author.name}</span>}
          {video.duration > 0 && <span>{Math.round(video.duration)} 秒</span>}
          {video.bytes > 0 && <span>{formatBytes(video.bytes)}</span>}
          {platform === 'weixin' && <span>{video.key ? '已提供解密密钥' : 'MP4'}</span>}
        </div>
        <div className={styles.actions}>
          {video.formats.length > 1 && <select className={styles.select} value={selected} disabled={busy}
            onChange={e => setSelected(Number(e.target.value))} aria-label={`视频 ${index + 1} 清晰度`}>
            {video.formats.map((f, i) => <option value={i} key={f.url}>{f.label}{i === 0 ? ' · 最佳' : ''}</option>)}
          </select>}
          <button className={styles.button} onClick={handleDownload} disabled={busy}>
            {busy ? <LoaderCircle size={17} className={styles.spin} /> : <Download size={17} />}
            {busy ? '正在下载' : '下载 MP4'}
          </button>
          {busy && <button type="button" className={styles.iconButton} onClick={cancel} title="取消下载" aria-label="取消下载"><X size={17} /></button>}
        </div>
        {busy && <div className={styles.progress} role="status">
          <progress max={state.total || undefined} value={state.total ? state.bytes : undefined} aria-label="下载进度" />
          <span>{state.bytes ? `${formatBytes(state.bytes)}${state.total ? ` / ${formatBytes(state.total)}` : ''}` : '正在获取视频'}</span>
        </div>}
        {state.phase === 'done' && <div className={styles.status} role="status"><CircleCheck size={15} />视频已保存</div>}
        {state.error && <div className={`${styles.status} ${styles.error}`} role="alert"><AlertCircle size={15} />{state.error}</div>}
      </div>
    </article>
  );
}
