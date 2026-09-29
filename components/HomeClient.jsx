'use client';

import { useState, useRef, useEffect } from 'react';
import { DICT } from '@/lib/i18n';

/* ---------- 工具函数 ---------- */

function formatDuration(sec) {
  if (!sec || sec <= 0) return '';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function proxied(url, inline = false) {
  if (!url) return '';
  return `/api/download?u=${encodeURIComponent(url)}${inline ? '&inline=1' : ''}`;
}

/** 前端链接形态预检（与后端校验同口径） */
function looksLikeTikTok(raw) {
  try {
    const u = new URL(String(raw).trim());
    if (!/^https?:$/.test(u.protocol)) return false;
    return /(^|\.)tiktok\.com$/i.test(u.hostname);
  } catch {
    return false;
  }
}

/** 清洗为可用于文件名的片段：去 emoji、去非法字符、限长 */
function cleanTitle(text, max = 50) {
  return String(text || '')
    .replace(/[\uFE0F\u200D\u20E3]/g, '')
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/[\\/:*?"<>|#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
    .trim();
}

const SAMPLE_URL = 'https://www.tiktok.com/@khaby.lame/video/6999284772195421445';

const WHY_ICONS = ['∞', '◌', '♪', 'HD', '∅', '▣'];

const HOWTO_ICONS = [
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></svg>,
  <svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="4" width="14" height="17" rx="2.5" /><path d="M9 4.5V3.8A1.3 1.3 0 0 1 10.3 2.5h3.4A1.3 1.3 0 0 1 15 3.8v.7" /><path d="M9 11h6M9 15h4" /></svg>,
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5v11" /><path d="m7.5 10.5 4.5 4.5 4.5-4.5" /><path d="M4.5 19.5h15" /></svg>,
  <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" /><path d="M4 9h16" /></svg>,
];

/* ---------- 滚动进度条 ---------- */

function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="scroll-progress" style={{ width: `${pct}%` }} />;
}

/* ---------- 主组件 ---------- */

export default function HomeClient({ locale = 'en' }) {
  const t = DICT[locale] || DICT.en;
  const [url, setUrl] = useState('');
  const [phase, setPhase] = useState('idle'); // idle | loading | success | error
  const [stage, setStage] = useState(0);
  const [errMsg, setErrMsg] = useState('');
  const [video, setVideo] = useState(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const resultRef = useRef(null);

  /* 路由语言同步到 <html lang> */
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale]);

  /* 感知性能：loading 分步推进 */
  useEffect(() => {
    if (phase !== 'loading') return;
    setStage(0);
    const t1 = setTimeout(() => setStage(1), 1200);
    const t2 = setTimeout(() => setStage(2), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  async function handleParse() {
    const value = url.trim();
    if (!value) {
      setErrMsg(t.hero.stEmpty);
      setPhase('error');
      inputRef.current?.focus();
      return;
    }
    if (!looksLikeTikTok(value)) {
      setErrMsg(t.hero.stInvalid);
      setPhase('error');
      inputRef.current?.focus();
      return;
    }
    setPhase('loading');
    setErrMsg('');
    setVideo(null);
    setCopied(false);
    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrMsg(json.error || t.hero.stFail);
        setPhase('error');
      } else {
        setVideo(json.video);
        setPhase('success');
        setTimeout(
          () => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
          80
        );
      }
    } catch {
      setErrMsg(t.hero.stNetFail);
      setPhase('error');
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setPhase('idle');
        setErrMsg('');
        inputRef.current?.focus();
      }
    } catch {
      setErrMsg(t.hero.stPasteFail);
      setPhase('error');
    }
  }

  async function handleCopyInfo() {
    if (!video) return;
    const text = [
      video.title || t.result.untitled,
      video.author?.name ? `${t.result.infoAuthor}${video.author.name}` : '',
      video.author?.uniqueId ? `@${video.author.uniqueId}` : '',
      video.duration ? `${t.result.infoDuration}${formatDuration(video.duration)}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrMsg(t.hero.stCopyFail);
      setPhase('error');
    }
  }

  /** 下载文件名主体：作者-标题（无标题时用视频 ID） */
  function fileNameBase() {
    const author = cleanTitle(video?.author?.uniqueId || video?.author?.name, 24) || 'tiktok';
    const title = cleanTitle(video?.title);
    return title ? `${author}-${title}` : `${author}-${video?.id || 'video'}`;
  }

  /** 下载链接：把文件名一并传给后端写入 Content-Disposition */
  function mediaUrl(format) {
    return `/api/download?u=${encodeURIComponent(format.url)}&name=${encodeURIComponent(
      fileNameBase()
    )}`;
  }

  /* 输入框下方的链接状态行 */
  let status = null;
  if (phase === 'loading') status = { cls: 'busy', text: t.hero.stLoading };
  else if (phase === 'error') status = { cls: 'bad', text: errMsg || t.hero.stFail };
  else if (phase === 'success') status = { cls: 'good', text: t.hero.stSuccess };
  else if (url.trim())
    status = looksLikeTikTok(url)
      ? { cls: 'good', text: t.hero.stValid }
      : { cls: 'bad', text: t.hero.stInvalid };

  return (
    <>
      <ScrollProgress />

      {/* 顶部导航 */}
      <nav className="nav">
        <div className="nav-inner">
          <a className="brand" href="#top">
            <span className="brand-mark">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3v12.2a3.3 3.3 0 1 1-2.6-3.24"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 3c.5 2.5 2.2 4.1 4.9 4.5"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            VidSaveNow
          </a>
          <div className="nav-links">
            <a href="#downloader">{t.nav.downloader}</a>
            <a href="#howto">{t.nav.howto}</a>
            <a href="#faq">{t.nav.faq}</a>
            <a className="lang" href={t.altLocale.href}>
              {t.altLocale.label}
            </a>
          </div>
        </div>
      </nav>

      <main id="top">
        {/* Hero：只做转化 */}
        <div className="hero">
          <div className="hero-bg" aria-hidden="true">
            <span className="glow glow-cyan" />
            <span className="glow glow-pink" />
            <span className="glow glow-violet" />
          </div>

          <div className="container hero-inner">
            <h1>{t.hero.h1}</h1>
            <p className="lede">{t.hero.sub}</p>

            <div className="parser" id="downloader">
              <div className="input-shell">
                <div className="input-line">
                  <input
                    ref={inputRef}
                    type="url"
                    inputMode="url"
                    placeholder={t.hero.placeholder}
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (phase !== 'idle') setPhase('idle');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleParse()}
                    disabled={phase === 'loading'}
                    aria-label={t.hero.placeholder}
                  />
                  <button
                    className="paste-btn"
                    onClick={handlePaste}
                    disabled={phase === 'loading'}
                  >
                    {t.hero.paste}
                  </button>
                </div>
                <button
                  className="btn-primary"
                  onClick={handleParse}
                  disabled={phase === 'loading'}
                >
                  {phase === 'loading' ? t.hero.parsing : t.hero.download}
                </button>
              </div>

              <div className={`input-status ${status?.cls || ''}`} role="status">
                {status ? status.text : t.hero.hint}
              </div>

              <div className="input-tools">
                <span>{t.hero.trust}</span>
                <button
                  className="link-btn"
                  onClick={() => {
                    setUrl(SAMPLE_URL);
                    setPhase('idle');
                  }}
                >
                  {t.hero.sample}
                </button>
              </div>

              {phase === 'loading' && (
                <div className="loading">
                  <div className="loading-title">
                    <span className="spinner" />
                    {t.loading.title}
                  </div>
                  <ul className="loading-steps">
                    {t.loading.steps.map((s, i) => (
                      <li key={s} className={i <= stage ? 'on' : ''}>
                        <span className="dot">{i < stage ? '✓' : i === stage ? '●' : '○'}</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {video && (
                <div className="result" ref={resultRef}>
                  <div className="result-main">
                    {video.cover && (
                      <div className="result-cover">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={proxied(video.cover, true)} alt={video.title || 'cover'} />
                        {video.duration > 0 && (
                          <span className="result-duration">{formatDuration(video.duration)}</span>
                        )}
                      </div>
                    )}
                    <div className="result-info">
                      <div className="result-author">
                        {video.author?.avatar && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={proxied(video.author.avatar, true)} alt="avatar" />
                        )}
                        <div>
                          <div className="name">{video.author?.name || t.result.unknownAuthor}</div>
                          {video.author?.uniqueId && (
                            <div className="uid">@{video.author.uniqueId}</div>
                          )}
                        </div>
                      </div>
                      {video.title && <p className="result-title">{video.title}</p>}
                      <div className="result-actions">
                        <button className="btn-ghost" onClick={handleCopyInfo}>
                          {copied ? t.result.copied : t.result.copyInfo}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="formats">
                    <div className="formats-head">{t.result.formatsHead}</div>
                    {video.formats.map((f, i) => (
                      <div className="format-row" key={i}>
                        <span className={`format-icon ${f.type}`}>
                          MP4
                        </span>
                        <span className="label">
                          {t.formats[f.kind] || f.label}
                          <span className="hint">
                            {`${t.result.saveAs} ${fileNameBase().slice(0, 28) || 'video'}.mp4`}
                          </span>
                        </span>
                        <a
                          className="btn-dl"
                          href={mediaUrl(f)}
                          download={`${fileNameBase()}.mp4`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ⬇ {t.result.dl}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container">
          {/* SEO 正文（首屏之下） */}
          <section className="section section-tight" id="about">
            <div className="section-head">
              <div className="eyebrow">{t.intro.eyebrow}</div>
              <h2>{t.intro.h2}</h2>
            </div>
            <div className="seo-copy">
              <p>{t.intro.p1}</p>
              <p>{t.intro.p2}</p>
            </div>
          </section>

          {/* Why：六宫格用户语言卖点 */}
          <section className="section" id="why">
            <div className="section-head">
              <div className="eyebrow">{t.why.eyebrow}</div>
              <h2>{t.why.h2}</h2>
            </div>
            <div className="features">
              {t.why.items.map(([title, desc], i) => (
                <div className="feature" key={title}>
                  <div className="ico mono">{WHY_ICONS[i] || '•'}</div>
                  <div className="t">{title}</div>
                  <div className="d">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* How to：傻瓜式四步 */}
          <section className="section" id="howto">
            <div className="section-head">
              <div className="eyebrow">{t.howto.eyebrow}</div>
              <h2>{t.howto.h2}</h2>
            </div>
            <ol className="howto">
              {t.howto.steps.map(([title, desc], i) => (
                <li className="howto-item" key={title}>
                  <div className="howto-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="howto-ico">{HOWTO_ICONS[i]}</div>
                  <div className="howto-body">
                    <div className="t">{title}</div>
                    <div className="d">{desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Mobile */}
          <section className="section" id="mobile">
            <div className="section-head">
              <div className="eyebrow">{t.mobile.eyebrow}</div>
              <h2>{t.mobile.h2}</h2>
            </div>
            <div className="device-grid">
              <ul className="device-points">
                {t.mobile.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="device-note">
                <div className="note-title">{t.mobile.noteTitle}</div>
                {t.mobile.notes.map(([k, v]) => (
                  <div className="note-row" key={k}>
                    <span className="k">{k}</span>
                    <span className="v">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PC */}
          <section className="section" id="pc">
            <div className="section-head">
              <div className="eyebrow">{t.pc.eyebrow}</div>
              <h2>{t.pc.h2}</h2>
            </div>
            <div className="device-grid">
              <ul className="device-points">
                {t.pc.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="device-note">
                <div className="note-title">{t.pc.noteTitle}</div>
                {t.pc.notes.map(([k, v]) => (
                  <div className="note-row" key={k}>
                    <span className="k">{k}</span>
                    <span className="v">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ：吃长尾词 */}
          <section className="section" id="faq">
            <div className="section-head">
              <div className="eyebrow">{t.faq.eyebrow}</div>
              <h2>{t.faq.h2}</h2>
            </div>
            <div className="faq-list">
              {t.faq.items.map(([q, a], i) => (
                <details key={q} open={i === 0}>
                  <summary>{q}</summary>
                  <div className="answer">{a}</div>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* 页脚 */}
        <footer>
          <div className="container">
            <div className="disclaimer">{t.footer.disclaimer}</div>
            <div className="footer-brand">VidSaveNow</div>
            <div className="footer-tag">{t.footer.tag}</div>
            <div className="footer-links">
              <a href="#">{t.footer.privacy}</a>
              <span>·</span>
              <a href="#">{t.footer.terms}</a>
              <span>·</span>
              <a href="#">{t.footer.contact}</a>
            </div>
            <div className="footer-copy">© {new Date().getFullYear()} VidSaveNow</div>
          </div>
        </footer>
      </main>
    </>
  );
}
