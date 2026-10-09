import HomeClient from '@/components/HomeClient';
import { tiktokMetadata, tiktokFaqJsonLd } from '@/lib/tiktok-seo.mjs';

export const metadata = tiktokMetadata('en');

export default function Page() {
  return <>
    <HomeClient locale="en" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tiktokFaqJsonLd('en')) }} />
  </>;
}
