import XClient from '@/components/XClient';
import { xMetadata, xFaqJsonLd } from '@/lib/x-copy.mjs';

export const metadata = xMetadata('en');

export default function Page() {
  return <><XClient locale="en" /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(xFaqJsonLd('en')).replace(/</g, '\\u003c') }} /></>;
}
