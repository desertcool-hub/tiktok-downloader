import HomeClient from '@/components/HomeClient';
import { tiktokMetadata, tiktokFaqJsonLd } from '@/lib/tiktok-seo.mjs';

export const metadata = tiktokMetadata('pt');
export default function Page() {
  return <><HomeClient locale="pt" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tiktokFaqJsonLd('pt')).replace(/</g, '\\u003c') }} />
  </>;
}
