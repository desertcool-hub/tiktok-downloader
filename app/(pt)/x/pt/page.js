import XClient from '@/components/XClient';
import { xMetadata, xFaqJsonLd } from '@/lib/x-copy.mjs';

export const metadata = xMetadata('pt');
export default function Page() {
  return <><XClient locale="pt" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(xFaqJsonLd('pt')).replace(/</g, '\\u003c') }} />
  </>;
}
