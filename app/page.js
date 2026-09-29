import HomeClient from '@/components/HomeClient';
import { DICT } from '@/lib/i18n';

const en = DICT.en;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

export const metadata = {
  title: 'VidSaveNow - Free TikTok Video Downloader (HD MP4)',
  description: en.metaDesc,
  keywords: [
    'VidSaveNow',
    'tiktok downloader',
    'tiktok video downloader',
    'download tiktok videos',
    'tiktok to mp4',
    'tiktok downloader no watermark',
    'how to download tiktok videos',
    'download tiktok video on iphone',
    'download tiktok video on pc',
  ],
  alternates: {
    canonical: '/',
    languages: { en: '/', 'zh-CN': '/zh' },
  },
  authors: [{ name: 'VidSaveNow', url: SITE_URL }],
  creator: 'VidSaveNow',
  publisher: 'VidSaveNow',
  category: 'technology',
  openGraph: {
    type: 'website',
    url: '/',
    title: 'VidSaveNow - Free TikTok Video Downloader (HD MP4)',
    description: en.metaDesc,
    siteName: 'VidSaveNow',
    locale: 'en_US',
    alternateLocale: ['zh_CN'],
    images: [
      { url: '/og.png', width: 1200, height: 630, alt: 'VidSaveNow - TikTok Video Downloader' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VidSaveNow - Free TikTok Video Downloader (HD MP4)',
    description: en.metaDesc,
    images: ['/og.png'],
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: en.faq.items.map(([name, text]) => ({
    '@type': 'Question',
    name,
    acceptedAnswer: { '@type': 'Answer', text },
  })),
};

export default function Page() {
  return (
    <>
      <HomeClient locale="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
