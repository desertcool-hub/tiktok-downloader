'use client';

import { LOCALES, platformPath } from '@/lib/locales.mjs';
import styles from './PlatformNavigation.module.css';

export default function LanguageSelector({ platform, locale }) {
  const current = LOCALES.find(item => item.code === locale) || LOCALES[0];
  return <select className={styles.language} aria-label={current.selectorLabel}
    value={platformPath(platform, current.code)} onChange={event => window.location.assign(event.target.value)}>
    {LOCALES.map(item => <option key={item.code} value={platformPath(platform, item.code)} lang={item.language}>{item.label}</option>)}
  </select>;
}
