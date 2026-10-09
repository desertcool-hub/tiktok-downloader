import { Analytics } from '@vercel/analytics/next';
import { DICT } from '@/lib/i18n';
import '../globals.css';

const SITE_URL = process.env.SITE_URL || 'https://www.vidsavenow.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Free Online Video Downloader',
  description: DICT.ja.metaDesc,
  robots: { index: true, follow: true, googleBot: {
    index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1,
  } },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: { siteName: 'VidSaveNow', type: 'website', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'VidSaveNow' }] },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#06070c' };

const siteJsonLd = {
  '@context': 'https://schema.org', '@type': 'WebSite', name: 'VidSaveNow', url: SITE_URL,
  inLanguage: ['en', 'zh-CN', 'ja'], description: DICT.ja.metaDesc,
};

export default function JaRootLayout({ children }) {
  return <html lang="ja"><body>
    {children}<Analytics />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
  </body></html>;
}
