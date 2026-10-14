import { ArrowLeft, Download, Mail } from 'lucide-react';
import { DICT } from '@/lib/i18n';
import { LOCALES, platformPath } from '@/lib/locales.mjs';
import { DOCUMENT_UPDATED, SITE_CONTACT_EMAIL, documentCopy, documentPath } from '@/lib/site-documents.mjs';
import FooterLinks from './FooterLinks';
import LanguageSelector from './LanguageSelector';
import styles from './SiteDocument.module.css';

export default function SiteDocument({ document, locale }) {
  const copy = documentCopy(document, locale);
  const home = platformPath('tiktok', locale);
  const paths = Object.fromEntries(LOCALES.map(item => [item.code, documentPath(document, item.code)]));
  return <div className={styles.page}>
    <header className={styles.header}>
      <a className="brand" href={home}><span className="brand-mark" aria-hidden="true"><Download size={17} /></span>VidSaveNow</a>
      <LanguageSelector locale={locale} paths={paths} />
    </header>
    <main className={styles.content}>
      <a className={styles.back} href={home}><ArrowLeft size={16} aria-hidden="true" />{copy.home}</a>
      <h1>{copy.title}</h1>
      <p className={styles.updated}>{copy.updated}: <time dateTime={DOCUMENT_UPDATED}>{DOCUMENT_UPDATED}</time></p>
      <p className={styles.lead}>{copy.description}</p>
      {copy.sections.map((section, index) => <section className={styles.section} key={section.title}>
        <h2><span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{section.title}</h2>
        {section.paragraphs.map(text => <p key={text}>{text}</p>)}
      </section>)}
      <div className={styles.contact}>
        <h2>{copy.email}</h2>
        <a href={`mailto:${SITE_CONTACT_EMAIL}`}><Mail size={18} aria-hidden="true" />{SITE_CONTACT_EMAIL}</a>
      </div>
      {document === 'privacy' && <a className={styles.reference} href="https://vercel.com/docs/analytics/privacy-policy">{copy.reference}</a>}
    </main>
    <footer className={styles.footer}>
      <FooterLinks locale={locale} labels={DICT[locale].footer} />
      <div className="footer-copy">© {new Date().getFullYear()} VidSaveNow</div>
    </footer>
  </div>;
}
