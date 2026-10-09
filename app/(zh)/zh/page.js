import HomeClient from '@/components/HomeClient';
import { tiktokMetadata, tiktokFaqJsonLd } from '@/lib/tiktok-seo.mjs';

export const metadata = tiktokMetadata('zh');

export default function Page() {
  return <>
    <HomeClient locale="zh" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tiktokFaqJsonLd('zh')) }} />
  </>;
}
