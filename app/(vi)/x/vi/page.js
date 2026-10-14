import XClient from '@/components/XClient';
import { xMetadata, xFaqJsonLd } from '@/lib/x-copy.mjs';

export const metadata = xMetadata('vi');
export default function Page() {
  return <><XClient locale="vi" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(xFaqJsonLd('vi')).replace(/</g, '\\u003c') }} />
  </>;
}
