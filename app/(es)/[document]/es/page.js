import { notFound } from 'next/navigation';
import SiteDocument from '@/components/SiteDocument';
import { SITE_DOCUMENTS, documentMetadata } from '@/lib/site-documents.mjs';

export const dynamicParams = false;
export function generateStaticParams() { return SITE_DOCUMENTS.map(document => ({ document })); }
export async function generateMetadata({ params }) {
  const { document } = await params;
  if (!SITE_DOCUMENTS.includes(document)) notFound();
  return documentMetadata(document, 'es');
}
export default async function Page({ params }) {
  const { document } = await params;
  if (!SITE_DOCUMENTS.includes(document)) notFound();
  return <SiteDocument document={document} locale="es" />;
}
