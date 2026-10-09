export const LOCALES = [
  { code: 'en', label: 'English', language: 'en', og: 'en_US', selectorLabel: 'Language' },
  { code: 'zh', label: '中文', language: 'zh-CN', og: 'zh_CN', selectorLabel: '语言' },
  { code: 'ja', label: '日本語', language: 'ja', og: 'ja_JP', selectorLabel: '言語' },
];

const PATHS = {
  tiktok: { en: '/', zh: '/zh', ja: '/ja' },
  x: { en: '/x/en', zh: '/x', ja: '/x/ja' },
  youtube: { en: '/youtube/en', zh: '/youtube', ja: '/youtube/ja' },
};

export function platformPath(platform, locale) {
  return PATHS[platform]?.[locale] || PATHS[platform]?.en || '/';
}

export function languageAlternates(platform) {
  return Object.fromEntries(LOCALES.map(locale => [locale.language, platformPath(platform, locale.code)]));
}

export function htmlLanguage(locale) {
  return LOCALES.find(item => item.code === locale)?.language || 'en';
}

export function openGraphLocales(locale) {
  const current = LOCALES.find(item => item.code === locale) || LOCALES[0];
  return { locale: current.og, alternateLocale: LOCALES.filter(item => item !== current).map(item => item.og) };
}
