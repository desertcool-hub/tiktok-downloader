'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Check, Download, X } from 'lucide-react';
import useVideoDownload, { videoFilename } from './useVideoDownload';
import styles from './XVideoResult.module.css';
import { youtubeDownloadUrl, youtubeCoverUrl } from './youtube-media.mjs';
import { youtubeErrorMessage } from '@/lib/youtube-copy.mjs';

function duration(sec) { return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`; }
function bytes(n) { return `${(n / 1024 / 1024).toFixed(1)} MB`; }

export default function XVideoResult({ video, index, t, locale, platform = 'x' }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const youtube = platform === 'youtube';
  const { state, download, cancel } = useVideoDownload(youtube ? { maxBytes: 4 * 1024 * 1024 } : undefined);
  const busy = state.phase === 'loading';
  const name = videoFilename(video, index);
  const cover = youtube ? youtubeCoverUrl(video.cover) : video.cover ? `/api/xdownload?u=${encodeURIComponent(video.cover)}&inline=1` : null;
  const formats = youtube ? (video.formats || []).filter(format => youtubeDownloadUrl(format.url, name)) : video.formats;
  function mediaUrl(format) { return youtube ? youtubeDownloadUrl(format.url, name) : `/api/xdownload?u=${encodeURIComponent(format.url)}&name=${encodeURIComponent(name)}`; }
  async function copyInfo() {
    try {
      await navigator.clipboard.writeText([video.title || t.result.untitled,
        video.author?.name ? `${t.result.infoAuthor}${video.author.name}` : '',
        video.duration > 0 ? `${t.result.infoDuration}${duration(video.duration)}` : ''].filter(Boolean).join('\n'));
      setCopyError(''); setCopied(true); clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch { setCopyError(t.hero.stCopyFail); }
  }
  function downloadLink(format, primary = false) {
    return <a key={format.url} className={`cta ${primary ? 'cta-primary' : 'cta-secondary'} ${busy ? styles.disabled : ''}`}
      href={mediaUrl(format)} download={name} aria-disabled={busy} rel="noopener noreferrer"
      onClick={e => {
        // Keep native link actions available for new tabs and copying the URL.
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        e.preventDefault(); if (!busy) download(mediaUrl(format), {}, name);
      }}>
      <span className="cta-ico" aria-hidden="true"><Download size={primary ? 26 : 20} /></span>
      <span className="cta-copy"><span className="cta-label">{primary ? t.result.primaryCta : t.result.secondaryCta}</span>
        <span className="cta-sub">{primary ? t.result.primarySub : t.result.secondarySub} · {format.label}</span></span>
    </a>;
  }
  return <article className="result" aria-label={`${locale === 'zh' ? '视频' : locale === 'ja' ? '動画' : 'Video'} ${index + 1}`}>
    <div className="result-main">
      {cover && <div className="result-cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt={video.title || t.result.untitled} loading="lazy" />
        {video.duration > 0 && <span className="result-duration">{duration(video.duration)}</span>}
      </div>}
      <div className="result-info">
        <div className="result-author"><div><div className="name">{video.author?.name || t.result.unknownAuthor}</div></div></div>
        <p className="result-title">{video.title || t.result.untitled}</p>
        <div className="result-actions"><button className={`btn-ghost ${styles.copy}`} onClick={copyInfo}><span aria-hidden="true">{copied ? <Check size={14} /> : <Copy size={14} />}</span>{copied ? t.result.copied : t.result.copyInfo}</button></div>
        {copyError && <div className={styles.error} role="alert">{copyError}</div>}
      </div>
    </div>
    <div className="cta-panel">
      {formats[0] && downloadLink(formats[0], true)}
      {formats[1] && downloadLink(formats[1])}
      {formats.length > 2 && <details className={styles.more}><summary>{t.result.moreHead}</summary><div className={styles.options}>{formats.slice(2).map(f => downloadLink(f))}</div></details>}
      {youtube && !formats.length && <div className={styles.error} role="alert">{youtubeErrorMessage(locale, 'NO_VIDEO')}</div>}
      {busy && <div className={styles.progress} role="status">
        <progress max={state.total || undefined} value={state.total ? state.bytes : undefined} aria-label={t.result.progress} />
        <span>{t.result.downloading}{state.bytes > 0 ? ` · ${bytes(state.bytes)}${state.total ? ` / ${bytes(state.total)}` : ''}` : '…'}</span>
        <button className="btn-ghost" onClick={cancel} aria-label={t.result.cancel} title={t.result.cancel}><X size={16} /></button>
      </div>}
      {state.phase === 'done' && <div className={styles.saved} role="status">{t.result.saved}</div>}
      {state.error && <div className={styles.error} role="alert">{youtube ? youtubeErrorMessage(locale, state.errorCode || 'DOWNLOAD_FAILED', state.errorStatus, 'DOWNLOAD_FAILED') : locale === 'zh' ? state.error : locale === 'ja' ? 'ダウンロードに失敗しました。リンクを再解析してください。256 MB を超える動画にはパソコンの Chrome または Edge をお使いください。' : 'Download failed. Try parsing the link again, or use desktop Chrome / Edge for files larger than 256 MB.'}</div>}
    </div>
  </article>;
}
