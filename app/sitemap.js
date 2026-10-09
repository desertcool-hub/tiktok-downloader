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
          ja: `${SITE_URL}/ja`,
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
          ja: `${SITE_URL}/ja`,
        },
      },
    },
    {
      url: `${SITE_URL}/weixin`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          'zh-CN': `${SITE_URL}/weixin`,
        },
      },
    },
    {
      url: `${SITE_URL}/x`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { en: `${SITE_URL}/x/en`, 'zh-CN': `${SITE_URL}/x`, ja: `${SITE_URL}/x/ja` } },
    },
    {
      url: `${SITE_URL}/x/en`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { en: `${SITE_URL}/x/en`, 'zh-CN': `${SITE_URL}/x`, ja: `${SITE_URL}/x/ja` } },
    },
    {
      url: `${SITE_URL}/youtube`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { en: `${SITE_URL}/youtube/en`, 'zh-CN': `${SITE_URL}/youtube`, ja: `${SITE_URL}/youtube/ja` } },
    },
    {
      url: `${SITE_URL}/youtube/en`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { en: `${SITE_URL}/youtube/en`, 'zh-CN': `${SITE_URL}/youtube`, ja: `${SITE_URL}/youtube/ja` } },
    },
    {
      url: `${SITE_URL}/ja`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: { languages: { en: `${SITE_URL}/`, 'zh-CN': `${SITE_URL}/zh`, ja: `${SITE_URL}/ja` } },
    },
    {
      url: `${SITE_URL}/x/ja`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { en: `${SITE_URL}/x/en`, 'zh-CN': `${SITE_URL}/x`, ja: `${SITE_URL}/x/ja` } },
    },
    {
      url: `${SITE_URL}/youtube/ja`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { en: `${SITE_URL}/youtube/en`, 'zh-CN': `${SITE_URL}/youtube`, ja: `${SITE_URL}/youtube/ja` } },
    },
  ];
}
