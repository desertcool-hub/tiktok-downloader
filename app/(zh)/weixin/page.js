import WeixinClient from '@/components/WeixinClient';
import { WX } from '@/lib/wx-i18n';

export const metadata = {
  title: '微信视频号视频下载 - 密钥下载与本地解密 | VidSaveNow',
  description:
    '微信视频号视频下载：支持视频直链与密钥、导入 wx_channel JSON 浏览记录及浏览器本地解密。分享链接解析需已连接的电脑端服务。',
  keywords: [
    '视频号视频下载',
    '微信视频号下载',
    '视频号分享链接下载',
    '视频号直链下载',
    '视频号mp4',
    'finder.video.qq.com 下载',
    '视频号视频怎么保存',
  ],
  alternates: {
    canonical: '/weixin',
  },
  openGraph: {
    type: 'website',
    url: '/weixin',
    title: '微信视频号视频下载 - 密钥下载与本地解密 | VidSaveNow',
    description:
      '支持视频直链与密钥下载、JSON 浏览记录导入和本地文件解密。',
    siteName: 'VidSaveNow',
    locale: 'zh_CN',
    images: [
      { url: '/og.png', width: 1200, height: 630, alt: 'VidSaveNow - 微信视频号视频直链代下' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '微信视频号视频下载 - 密钥下载与本地解密 | VidSaveNow',
    description:
      '支持视频直链与密钥下载、JSON 浏览记录导入和本地文件解密。',
    images: ['/og.png'],
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: WX.faq.items.map(([name, text]) => ({
    '@type': 'Question',
    name,
    acceptedAnswer: { '@type': 'Answer', text },
  })),
};

export default function Page() {
  return (
    <>
      <WeixinClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
