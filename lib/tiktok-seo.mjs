import { DICT } from './i18n.js';
import { platformPath, languageAlternates, openGraphLocales } from './locales.mjs';

const TITLE = 'Free Online Video Downloader-Tiktok';
const KEYWORDS = {
  en: ['VidSaveNow', 'tiktok downloader', 'tiktok video downloader', 'download tiktok videos', 'tiktok to mp4',
    'tiktok downloader no watermark', 'how to download tiktok videos', 'download tiktok video on iphone', 'download tiktok video on pc',
    'X.com video downloader', 'Twitter video downloader', 'download X videos', 'YouTube video downloader', 'YouTube Shorts downloader'],
  zh: ['VidSaveNow', 'tiktok下载', 'tiktok视频下载', 'tiktok在线下载', 'tiktok怎么下载', 'tiktok mp4', 'tiktok去水印',
    '手机上怎么下载tiktok视频', '电脑怎么下载tiktok视频', 'X.com视频下载', 'Twitter视频下载', '推特视频下载', 'YouTube视频下载', 'YouTube Shorts下载'],
  ja: ['VidSaveNow', 'TikTok 動画ダウンロード', 'TikTok 動画保存', 'TikTok MP4', 'TikTok ウォーターマークなし',
    'TikTok iPhone 保存', 'TikTok パソコン 保存', 'X.com 動画ダウンロード', 'Twitter 動画保存', 'YouTube 動画ダウンロード', 'YouTube Shorts 保存'],
};

export function tiktokMetadata(locale = 'en') {
  const t = DICT[locale] || DICT.en;
  const title = TITLE;
  const canonical = platformPath('tiktok', locale);
  return {
    title, description: t.metaDesc, keywords: KEYWORDS[locale] || KEYWORDS.en,
    alternates: { canonical, languages: languageAlternates('tiktok') },
    authors: [{ name: 'VidSaveNow', url: process.env.SITE_URL || 'https://www.vidsavenow.com' }],
    creator: 'VidSaveNow', publisher: 'VidSaveNow', category: 'technology',
    openGraph: { type: 'website', url: canonical, title, description: t.metaDesc, siteName: 'VidSaveNow',
      ...openGraphLocales(locale), images: [{ url: '/og.png', width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description: t.metaDesc, images: ['/og.png'] },
  };
}

export function tiktokFaqJsonLd(locale = 'en') {
  const t = DICT[locale] || DICT.en;
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.faq.items.map(([name, text]) => ({
    '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text },
  })) };
}
