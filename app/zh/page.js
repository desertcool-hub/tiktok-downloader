import HomeClient from '@/components/HomeClient';
import { DICT } from '@/lib/i18n';

const zh = DICT.zh;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

export const metadata = {
  title: 'VidSaveNow - TikTok 视频在线下载工具（高清 MP4）',
  description: zh.metaDesc,
  keywords: [
    'VidSaveNow',
    'tiktok下载',
    'tiktok视频下载',
    'tiktok在线下载',
    'tiktok怎么下载',
    'tiktok mp4',
    'tiktok去水印',
    '手机上怎么下载tiktok视频',
    '电脑怎么下载tiktok视频',
  ],
  alternates: {
    canonical: '/zh',
    languages: { en: '/', 'zh-CN': '/zh' },
  },
  authors: [{ name: 'VidSaveNow', url: SITE_URL }],
  creator: 'VidSaveNow',
  publisher: 'VidSaveNow',
  category: 'technology',
  openGraph: {
    type: 'website',
    url: '/zh',
    title: 'VidSaveNow - TikTok 视频在线下载工具（高清 MP4）',
    description: zh.metaDesc,
    siteName: 'VidSaveNow',
    locale: 'zh_CN',
    alternateLocale: ['en_US'],
    images: [
      { url: '/og.png', width: 1200, height: 630, alt: 'VidSaveNow - TikTok 视频在线下载工具' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VidSaveNow - TikTok 视频在线下载工具（高清 MP4）',
    description: zh.metaDesc,
    images: ['/og.png'],
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: zh.faq.items.map(([name, text]) => ({
    '@type': 'Question',
    name,
    acceptedAnswer: { '@type': 'Answer', text },
  })),
};

export default function Page() {
  return (
    <>
      <HomeClient locale="zh" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
