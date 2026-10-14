import HomeClient from '@/components/HomeClient';
import { tiktokMetadata, tiktokFaqJsonLd } from '@/lib/tiktok-seo.mjs';

export const metadata = tiktokMetadata('vi');
export default function Page() {
  return <><HomeClient locale="vi" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tiktokFaqJsonLd('vi')).replace(/</g, '\\u003c') }} />
  </>;
}
