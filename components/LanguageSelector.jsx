'use client';

import { LOCALES, platformPath } from '@/lib/locales.mjs';
import styles from './PlatformNavigation.module.css';

export default function LanguageSelector({ platform, locale, paths }) {
  const current = LOCALES.find(item => item.code === locale) || LOCALES[0];
  const pathFor = code => paths?.[code] || platformPath(platform, code);
  return <select className={styles.language} aria-label={current.selectorLabel}
    value={pathFor(current.code)} onChange={event => window.location.assign(event.target.value)}>
    {LOCALES.map(item => <option key={item.code} value={pathFor(item.code)} lang={item.language}>{item.label}</option>)}
  </select>;
}
