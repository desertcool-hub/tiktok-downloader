import styles from './PlatformNavigation.module.css';
import { Play } from 'lucide-react';

export default function PlatformNavigation({ platform = 'tiktok', locale = 'en', t }) {
  const zh = locale === 'zh';
  return <nav className={`nav ${styles.nav}`}>
    <div className="nav-inner">
      <a className="brand" href="#top">
        <span className="brand-mark" aria-hidden="true">
          {platform === 'youtube' ? <Play size={16} /> : platform === 'x' ? '𝕏' : <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3v12.2a3.3 3.3 0 1 1-2.6-3.24" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M12 3c.5 2.5 2.2 4.1 4.9 4.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>}
        </span>VidSaveNow
      </a>
      <div className={`nav-links ${styles.links}`}>
        <div className={styles.platforms} aria-label={zh ? '下载平台' : 'Download platforms'}>
          <a href={zh ? '/zh' : '/'} aria-current={platform === 'tiktok' ? 'page' : undefined}>TikTok</a>
          <a href={zh ? '/x' : '/x/en'} aria-current={platform === 'x' ? 'page' : undefined}>X / Twitter</a>
          <a href={zh ? '/youtube' : '/youtube/en'} aria-current={platform === 'youtube' ? 'page' : undefined}>YouTube</a>
        </div>
        <a className={styles.sectionLink} href="#howto">{t.nav.howto}</a>
        <a className={styles.sectionLink} href="#faq">{t.nav.faq}</a>
        <a className={`lang ${styles.language}`} href={t.altLocale.href}>{t.altLocale.label}</a>
      </div>
    </div>
  </nav>;
}
