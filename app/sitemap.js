import { LOCALES, platformPath, languageAlternates } from '../lib/locales.mjs';
import { SITE_DOCUMENTS, DOCUMENT_UPDATED, documentPath } from '../lib/site-documents.mjs';

const SITE_URL = process.env.SITE_URL || 'https://www.vidsavenow.com';

function absoluteAlternates(paths) {
  return { languages: Object.fromEntries(Object.entries(paths).map(([language, path]) => [language, `${SITE_URL}${path}`])) };
}

export default function sitemap() {
  const now = new Date();
  const platforms = ['tiktok', 'x', 'youtube'].flatMap(platform => LOCALES.map(locale => ({
    url: `${SITE_URL}${platformPath(platform, locale.code)}`, lastModified: now,
    changeFrequency: platform === 'tiktok' ? 'daily' : 'weekly',
    priority: platform === 'tiktok' ? locale.code === 'en' ? 1 : 0.9 : 0.8,
    alternates: absoluteAlternates(languageAlternates(platform)),
  })));
  const documents = SITE_DOCUMENTS.flatMap(document => LOCALES.map(locale => ({
    url: `${SITE_URL}${documentPath(document, locale.code)}`, lastModified: new Date(DOCUMENT_UPDATED),
    changeFrequency: 'monthly', priority: 0.3,
    alternates: absoluteAlternates(Object.fromEntries(LOCALES.map(item => [item.language, documentPath(document, item.code)]))),
  })));
  return [...platforms, {
    url: `${SITE_URL}/weixin`, lastModified: now, changeFrequency: 'weekly', priority: 0.8,
    alternates: absoluteAlternates({ 'zh-CN': '/weixin' }),
  }, ...documents];
}
