import styles from './PlatformNavigation.module.css';
import { Play } from 'lucide-react';
import { platformPath } from '@/lib/locales.mjs';
import LanguageSelector from './LanguageSelector';

export default function PlatformNavigation({ platform = 'tiktok', locale = 'en', t }) {
  const platformsLabel = { zh: '下载平台', en: 'Download platforms', ja: 'ダウンロード対象' }[locale] || 'Download platforms';
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
        <div className={styles.platforms} aria-label={platformsLabel}>
          <a href={platformPath('tiktok', locale)} aria-current={platform === 'tiktok' ? 'page' : undefined}>TikTok</a>
          <a href={platformPath('x', locale)} aria-current={platform === 'x' ? 'page' : undefined}>X / Twitter</a>
          <a href={platformPath('youtube', locale)} aria-current={platform === 'youtube' ? 'page' : undefined}>YouTube</a>
        </div>
        <a className={styles.sectionLink} href="#howto">{t.nav.howto}</a>
        <a className={styles.sectionLink} href="#faq">{t.nav.faq}</a>
        <LanguageSelector platform={platform} locale={locale} />
      </div>
    </div>
  </nav>;
}
