'use client';

import { useEffect, useRef, useState } from 'react';
import PlatformNavigation from './PlatformNavigation';
import XVideoResult from './XVideoResult';
import XPageContent from './XPageContent';

export default function VideoPlatformClient({ locale = 'zh', platform, t, validateUrl, endpoint, errorMessage, timeoutMs = 30_000 }) {
  const [url, setUrl] = useState('');
  const [phase, setPhase] = useState('idle');
  const [stage, setStage] = useState(0);
  const [error, setError] = useState('');
  const [videos, setVideos] = useState([]);
  const [pct, setPct] = useState(0);
  const controller = useRef(null);
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const scrollTimer = useRef(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        setPct(max > 0 ? Math.min(100, el.scrollTop / max * 100) : 0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      controller.current?.abort();
      clearTimeout(scrollTimer.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;
    setStage(0);
    const first = setTimeout(() => setStage(1), 1200);
    const second = setTimeout(() => setStage(2), 2600);
    return () => { clearTimeout(first); clearTimeout(second); };
  }, [phase]);

  function changeUrl(value) {
    setUrl(value); setPhase('idle'); setError(''); setVideos([]);
    clearTimeout(scrollTimer.current);
  }

  async function parse() {
    if (controller.current) return;
    const value = url.trim();
    if (!value || !validateUrl(value)) {
      setError(value ? t.hero.stInvalid : t.hero.stEmpty); setPhase('error');
      inputRef.current?.focus(); return;
    }
    setError(''); setVideos([]); setPhase('loading');
    const abort = new AbortController(); controller.current = abort;
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value }), signal: AbortSignal.any([abort.signal, AbortSignal.timeout(timeoutMs)]) });
      const json = await response.json();
      if (!response.ok || !json.success || !json.videos?.length) {
        const message = errorMessage ? errorMessage(json.code || (json.success ? 'NO_VIDEO' : undefined), response.status) : locale === 'zh' ? json.error : response.status === 429 ? 'Too many requests. Please try again later.'
          : json.code === 'NO_VIDEO' ? 'This post has no downloadable MP4 video. Live streams and image-only posts are not supported.' : t.hero.stFail;
        setError(message || t.hero.stFail); setPhase('error');
      } else {
        setVideos(json.videos); setPhase('success');
        scrollTimer.current = setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
      }
    } catch (e) {
      if (e.name !== 'AbortError') { setError(e.name === 'TimeoutError' ? t.hero.stTimeout : t.hero.stNetFail); setPhase('error'); }
    } finally { controller.current = null; }
  }

  async function paste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) { changeUrl(text.trim()); inputRef.current?.focus(); }
    } catch { setError(t.hero.stPasteFail); setPhase('error'); }
  }

  const status = phase === 'loading' ? { cls: 'busy', text: t.hero.stLoading }
    : phase === 'error' ? { cls: 'bad', text: error }
    : phase === 'success' ? { cls: 'good', text: t.hero.stSuccess }
    : url.trim() ? { cls: validateUrl(url) ? 'good' : 'bad', text: validateUrl(url) ? t.hero.stValid : t.hero.stInvalid } : null;

  return <>
    <div className="scroll-progress" style={{ width: `${pct}%` }} />
    <PlatformNavigation platform={platform} locale={locale} t={t} />
    <main id="top">
      <div className="hero">
        <div className="hero-bg" aria-hidden="true"><span className="glow glow-cyan" /><span className="glow glow-pink" /><span className="glow glow-violet" /></div>
        <div className="container hero-inner">
          <h1>{t.hero.h1}</h1><p className="lede">{t.hero.sub}</p>
          <div className="parser" id="downloader">
            <div className="input-shell">
              <div className="input-line">
                <input ref={inputRef} type="url" inputMode="url" placeholder={t.hero.placeholder} aria-label={t.hero.placeholder}
                  value={url} onChange={e => changeUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && parse()} disabled={phase === 'loading'} />
                <button className="paste-btn" onClick={paste} disabled={phase === 'loading'}>{t.hero.paste}</button>
              </div>
              <button className="btn-primary" onClick={parse} disabled={phase === 'loading'}>{phase === 'loading' ? t.hero.parsing : t.hero.download}</button>
            </div>
            <div className={`input-status ${status?.cls || ''}`} role="status">{status ? status.text : t.hero.hint}</div>
            <div className="input-tools"><span>{t.hero.trust}</span></div>
            {phase === 'loading' && <div className="loading">
              <div className="loading-title"><span className="spinner" />{t.loading.title}</div>
              <ul className="loading-steps">{t.loading.steps.map((s, i) => <li key={s} className={i <= stage ? 'on' : ''}><span className="dot">{i < stage ? '✓' : i === stage ? '●' : '○'}</span>{s}</li>)}</ul>
            </div>}
            {videos.length > 0 && <div ref={resultRef}>{videos.map((video, index) => <XVideoResult key={video.id} video={video} index={index} t={t} locale={locale} platform={platform} />)}</div>}
          </div>
        </div>
      </div>
      <XPageContent t={t} locale={locale} />
    </main>
  </>;
}
