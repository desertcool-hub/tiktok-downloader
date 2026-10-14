import { documentPath } from '@/lib/site-documents.mjs';

export default function FooterLinks({ locale = 'en', labels }) {
  return <div className="footer-links">
    <a href={documentPath('privacy', locale)}>{labels.privacy}</a><span>·</span>
    <a href={documentPath('terms', locale)}>{labels.terms}</a><span>·</span>
    <a href={documentPath('contact', locale)}>{labels.contact}</a>
  </div>;
}
