const SITE_URL = process.env.SITE_URL || 'https://www.vidsavenow.com';

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: `${SITE_URL}/`,
          'zh-CN': `${SITE_URL}/zh`,
        },
      },
    },
    {
      url: `${SITE_URL}/zh`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${SITE_URL}/`,
          'zh-CN': `${SITE_URL}/zh`,
        },
      },
    },
  ];
}
