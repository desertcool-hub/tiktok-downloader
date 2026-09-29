import './globals.css';

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'VidSaveNow - TikTok Video Downloader',
  description:
    'VidSaveNow is a free TikTok video downloader: paste a link and save HD MP4. No login, no watermark, works on any device. 免费在线 TikTok 视频下载工具。',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    siteName: 'VidSaveNow',
    type: 'website',
    images: [
      { url: '/og.png', width: 1200, height: 630, alt: 'VidSaveNow - TikTok Video Downloader' },
    ],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#06070c',
};

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'VidSaveNow',
  url: SITE_URL,
  inLanguage: ['en', 'zh-CN'],
  description:
    'Free online TikTok video downloader: save HD MP4 without login or watermark.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </body>
    </html>
  );
}
