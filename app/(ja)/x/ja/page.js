import XClient from '@/components/XClient';
import { xMetadata, xFaqJsonLd } from '@/lib/x-copy.mjs';

export const metadata = xMetadata('ja');

export default function Page() {
  return <><XClient locale="ja" /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(xFaqJsonLd('ja')) }} /></>;
}
