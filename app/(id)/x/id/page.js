import XClient from '@/components/XClient';
import { xMetadata, xFaqJsonLd } from '@/lib/x-copy.mjs';

export const metadata = xMetadata('id');
export default function Page() {
  return <><XClient locale="id" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(xFaqJsonLd('id')).replace(/</g, '\\u003c') }} />
  </>;
}
