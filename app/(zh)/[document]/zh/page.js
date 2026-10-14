import { notFound } from 'next/navigation';
import SiteDocument from '@/components/SiteDocument';
import { SITE_DOCUMENTS, documentMetadata } from '@/lib/site-documents.mjs';

export const dynamicParams = false;
export function generateStaticParams() { return SITE_DOCUMENTS.map(document => ({ document })); }
export function generateMetadata({ params }) {
  if (!SITE_DOCUMENTS.includes(params.document)) notFound();
  return documentMetadata(params.document, 'zh');
}
export default function Page({ params }) {
  if (!SITE_DOCUMENTS.includes(params.document)) notFound();
  return <SiteDocument document={params.document} locale="zh" />;
}
