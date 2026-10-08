import XClient from '@/components/XClient';
import { xMetadata, xFaqJsonLd } from '@/lib/x-copy.mjs';

export const metadata = xMetadata('zh');

export default function Page() {
  return <><XClient locale="zh" /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(xFaqJsonLd('zh')).replace(/</g, '\\u003c') }} /></>;
}
