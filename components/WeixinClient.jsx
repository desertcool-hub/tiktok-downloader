'use client';

import { useEffect, useRef, useState } from 'react';
import { ClipboardPaste, Search, LoaderCircle, AlertCircle, CircleCheck, FileInput, Unlock, Download } from 'lucide-react';
import { WX } from '@/lib/wx-i18n';
import { importWxRecords, isWxShareUrl, wxInputUrl } from '@/lib/weixin.mjs';
import { decryptWxBytes, validateWxKey, WX_ENCRYPTED_BYTES } from '@/lib/weixin-decrypt.mjs';
import { isMp4 } from '@/lib/platform-media.mjs';
import DownloadToolShell from './DownloadToolShell';
import VideoDownloadResult from './VideoDownloadResult';
import { saveVideoBlob } from './useVideoDownload';
import styles from './DownloadTools.module.css';

const TABS = [['link', '链接下载'], ['import', '导入记录'], ['local', '本地解密']];

export default function WeixinClient() {
  const [tab, setTab] = useState('link');
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [json, setJson] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [videos, setVideos] = useState([]);
  const [localResult, setLocalResult] = useState(null);
  const [shareAvailable, setShareAvailable] = useState(null);
  const controller = useRef(null);
  useEffect(() => {
    const abort = new AbortController();
    fetch('/api/wxparse', { signal: abort.signal }).then(r => r.json()).then(j => setShareAvailable(j.shareAvailable)).catch(() => {});
    return () => { abort.abort(); controller.current?.abort(); };
  }, []);

  function clear() { setError(''); setNotice(''); setVideos([]); setLocalResult(null); }
  async function parse(e) {
    e.preventDefault();
    if (busy) return;
    clear();
    if (isWxShareUrl(wxInputUrl(url)) && shareAvailable === false) {
      setError('分享链接解析尚未启用，请使用视频直链与密钥，或导入电脑端获取的 JSON 视频记录。');
      return;
    }
    setBusy(true);
    const abort = new AbortController(); controller.current = abort;
    const signal = AbortSignal.any([abort.signal, AbortSignal.timeout(45_000)]);
    try {
      const response = await fetch('/api/wxparse', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, key }), signal });
      const parsed = await response.json();
      if (!response.ok || !parsed.success) throw new Error(parsed.error || '解析失败');
      const video = parsed.video;
      const probe = await fetch('/api/wxdownload', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: video.url, key: video.key, probe: true }), signal });
      const info = await probe.json();
      if (!probe.ok || !info.success) throw new Error(info.error || '视频链接暂时不可用');
      setVideos([{ ...video, bytes: info.bytes }]);
      setNotice(info.encrypted ? '视频与密钥已验证，下载时将自动解密。' : '已识别可播放的 MP4 视频。');
    } catch (e) { if (e.name !== 'AbortError') setError(e.name === 'TimeoutError' ? '检测超时，请重新获取链接后再试' : e.message || '网络异常，请重试'); }
    finally { setBusy(false); controller.current = null; }
  }
  async function paste() {
    try { setUrl(await navigator.clipboard.readText()); clear(); }
    catch { setError('无法读取剪贴板，请在输入框中手动粘贴'); }
  }
  function importRecords(e) {
    e.preventDefault(); clear();
    try {
      const records = importWxRecords(json);
      setVideos(records); setNotice(`已导入 ${records.length} 个视频，重复地址已合并。下载时会检查链接与密钥。`);
    } catch (e) { setError(e.message); }
  }
  async function readJson(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    clear();
    if (selected.size > 1_000_000) { setError('记录文件过大，最多支持 1 MB'); return; }
    try { setJson(await selected.text()); }
    catch { setError('无法读取记录文件，请重新选择'); }
    e.target.value = '';
  }
  async function decryptLocal(e) {
    e.preventDefault(); clear();
    if (!file) { setError('请先选择需要解密的视频文件'); return; }
    setBusy(true);
    try {
      const validKey = validateWxKey(key);
      const head = new Uint8Array(await file.slice(0, WX_ENCRYPTED_BYTES).arrayBuffer());
      const decrypted = isMp4(head) ? head : decryptWxBytes(head, validKey);
      if (!isMp4(decrypted)) throw new Error('密钥不匹配或文件不是受支持的视频号 MP4，请重新获取原始文件与密钥');
      const blob = new Blob([decrypted, file.slice(head.length)], { type: 'video/mp4' });
      const name = `${file.name.replace(/\.[^.]+$/, '') || '视频号视频'}-已解密.mp4`;
      setLocalResult({ blob, name });
      setNotice(isMp4(head) ? '该文件已是可播放的 MP4，无需解密。' : '解密完成，文件未上传。');
    } catch (e) { setError(e.message || '文件处理失败，请重试'); }
    finally { setBusy(false); }
  }
  const keyField = <label className={styles.field}>
    <span className={styles.label}>解密密钥{tab === 'local' ? '（必填）' : '（加密视频必填）'}</span>
    <input className={styles.input} value={key} inputMode="numeric" autoComplete="off" placeholder="decodeKey / decryptKey"
      disabled={busy} required={tab === 'local'} onChange={e => { setKey(e.target.value); clear(); }} />
  </label>;
  return <DownloadToolShell platform="weixin" title="微信视频号视频下载" description="保存视频号 MP4，支持带密钥下载与已有文件解密。" faq={WX.faq.items}>
    <div className={styles.workspace}>
      <div className={styles.tabs} role="tablist" aria-label="下载方式">
        {TABS.map(([id, label]) => <button key={id} type="button" role="tab" id={`tab-${id}`} aria-controls={`panel-${id}`}
          aria-selected={tab === id} tabIndex={tab === id ? 0 : -1} disabled={busy}
          onKeyDown={e => {
            if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
              e.preventDefault();
              const next = e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (TABS.findIndex(t => t[0] === tab) + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
              setTab(TABS[next][0]); clear(); document.getElementById(`tab-${TABS[next][0]}`)?.focus();
            }
          }} onClick={() => { setTab(id); clear(); }}>{label}</button>)}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'link' && <form className={styles.form} onSubmit={parse}>
          <label className={styles.field}>
            <span className={styles.label}>视频地址或分享链接</span>
            <span className={styles.inputLine}>
              <input className={styles.input} value={url} required disabled={busy} placeholder="https://finder.video.qq.com/..."
                onChange={e => { setUrl(e.target.value); clear(); }} />
              <button type="button" className={styles.iconButton} title="粘贴链接" aria-label="粘贴链接" disabled={busy} onClick={paste}><ClipboardPaste size={19} /></button>
            </span>
          </label>
          {keyField}
          <button className={styles.button} disabled={busy}>{busy ? <LoaderCircle size={17} className={styles.spin} /> : <Search size={17} />}{busy ? '正在检测' : '检测视频'}</button>
          <p className={styles.note}>直链需与密钥对应。分享链接需站点连接的电脑端微信在线。</p>
        </form>}
        {tab === 'import' && <form className={styles.form} onSubmit={importRecords}>
          <label className={styles.field}><span className={styles.label}>JSON 视频记录</span>
            <input className={styles.file} type="file" accept=".json,application/json" onChange={readJson} />
            <textarea className={styles.textarea} value={json} required onChange={e => { setJson(e.target.value); clear(); }}
              placeholder={'[{"videoUrl":"https://finder.video.qq.com/...","decryptKey":"..."}]'} />
          </label>
          <button className={styles.button}><FileInput size={17} />导入视频</button>
          <p className={styles.note}>兼容 wx_channel 的 JSON 浏览记录；最多 100 条。记录仅在当前页面读取。</p>
        </form>}
        {tab === 'local' && <form className={styles.form} onSubmit={decryptLocal}>
          <label className={styles.field}><span className={styles.label}>原始视频文件</span>
            <input className={styles.file} type="file" disabled={busy} onChange={e => { setFile(e.target.files?.[0] || null); clear(); }} />
          </label>
          {keyField}
          <div className={styles.actions}>
            <button className={styles.button} disabled={busy}>{busy ? <LoaderCircle size={17} className={styles.spin} /> : <Unlock size={17} />}{busy ? '正在处理' : '解密文件'}</button>
            {localResult && <button type="button" className={`${styles.button} ${styles.secondary}`}
              onClick={() => saveVideoBlob(localResult.blob, localResult.name)}><Download size={17} />保存 MP4</button>}
          </div>
          <p className={styles.note}>视频文件在浏览器内处理，不会上传。</p>
        </form>}
      </div>
    </div>
    {error && <div className={`${styles.status} ${styles.error}`} role="alert"><AlertCircle size={16} />{error}</div>}
    {notice && <div className={styles.status} role="status"><CircleCheck size={16} />{notice}</div>}
    {videos.length > 0 && <section className={styles.results} aria-label="视频记录">
      <div className={styles.resultHeading}><h2>视频</h2><span>{videos.length} 个</span></div>
      {videos.map((video, index) => <VideoDownloadResult key={video.url} video={video} platform="weixin" index={index} />)}
    </section>}
  </DownloadToolShell>;
}
