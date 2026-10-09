import HomeClient from '@/components/HomeClient';
import { tiktokMetadata, tiktokFaqJsonLd } from '@/lib/tiktok-seo.mjs';

export const metadata = tiktokMetadata('ja');

export default function Page() {
  return <>
    <HomeClient locale="ja" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tiktokFaqJsonLd('ja')) }} />
  </>;
}
