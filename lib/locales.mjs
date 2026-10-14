export const LOCALES = [
  { code: 'en', label: 'English', language: 'en', og: 'en_US', selectorLabel: 'Language' },
  { code: 'zh', label: '中文', language: 'zh-CN', og: 'zh_CN', selectorLabel: '语言' },
  { code: 'ja', label: '日本語', language: 'ja', og: 'ja_JP', selectorLabel: '言語' },
  { code: 'id', label: 'Indonesia', language: 'id', og: 'id_ID', selectorLabel: 'Bahasa' },
  { code: 'es', label: 'Español', language: 'es', og: 'es_ES', selectorLabel: 'Idioma' },
  { code: 'pt', label: 'Português', language: 'pt-BR', og: 'pt_BR', selectorLabel: 'Idioma' },
  { code: 'vi', label: 'Tiếng Việt', language: 'vi', og: 'vi_VN', selectorLabel: 'Ngôn ngữ' },
];

const PATHS = {
  tiktok: { en: '/', zh: '/zh', ja: '/ja' },
  x: { en: '/x/en', zh: '/x', ja: '/x/ja' },
  youtube: { en: '/youtube/en', zh: '/youtube', ja: '/youtube/ja' },
};

export function platformPath(platform, locale) {
  if (!PATHS[platform]) return '/';
  if (PATHS[platform][locale]) return PATHS[platform][locale];
  if (LOCALES.some(item => item.code === locale)) return platform === 'tiktok' ? `/${locale}` : `/${platform}/${locale}`;
  return PATHS[platform].en;
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
