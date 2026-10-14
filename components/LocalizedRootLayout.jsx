import { Analytics } from '@vercel/analytics/next';
import { DICT } from '@/lib/i18n';
import { LOCALES, htmlLanguage } from '@/lib/locales.mjs';

const SITE_URL = process.env.SITE_URL || 'https://www.vidsavenow.com';

export function localizedLayoutMetadata(locale) {
  return {
    metadataBase: new URL(SITE_URL), title: 'VidSaveNow', description: DICT[locale].metaDesc,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true,
      'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: { siteName: 'VidSaveNow', type: 'website', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'VidSaveNow' }] },
    twitter: { card: 'summary_large_image', images: ['/og.png'] },
  };
}

export default function LocalizedRootLayout({ children, locale }) {
  const siteJsonLd = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'VidSaveNow', url: SITE_URL,
    inLanguage: LOCALES.map(item => item.language), description: DICT[locale].metaDesc };
  return <html lang={htmlLanguage(locale)}><body>{children}<Analytics />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd).replace(/</g, '\\u003c') }} />
  </body></html>;
}
