import { Smartphone, Clipboard, Download, FolderOpen, Film, MonitorPlay, Gift, UserRound } from 'lucide-react';
import FooterLinks from './FooterLinks';

const featureIcons = [Film, MonitorPlay, Gift, UserRound];
const stepIcons = [Smartphone, Clipboard, Download, FolderOpen];

function Heading({ section }) {
  return <div className="section-head"><div className="eyebrow">{section.eyebrow}</div><h2>{section.h2}</h2></div>;
}

export default function XPageContent({ t, locale = 'en' }) {
  return <>
    <div className="container">
      <section className="section section-tight" id="about">
        <Heading section={t.intro} /><div className="seo-copy"><p>{t.intro.p1}</p><p>{t.intro.p2}</p></div>
      </section>
      <section className="section" id="why">
        <Heading section={t.why} /><div className="features">{t.why.items.map(([title, desc], i) => {
          const Icon = featureIcons[i];
          return <div className="feature" key={title}><div className="ico mono"><Icon size={25} aria-hidden="true" /></div><div className="t">{title}</div><div className="d">{desc}</div></div>;
        })}</div>
      </section>
      <section className="section" id="howto">
        <Heading section={t.howto} /><ol className="howto">{t.howto.steps.map(([title, desc], i) => {
          const Icon = stepIcons[i];
          return <li className="howto-item" key={title}><div className="howto-num">{String(i + 1).padStart(2, '0')}</div><div className="howto-ico"><Icon aria-hidden="true" /></div><div className="howto-body"><div className="t">{title}</div><div className="d">{desc}</div></div></li>;
        })}</ol>
      </section>
      {['mobile', 'pc'].map(id => <section className="section" id={id} key={id}>
        <Heading section={t[id]} /><div className="device-grid">
          <ul className="device-points">{t[id].points.map(p => <li key={p}>{p}</li>)}</ul>
          <div className="device-note"><div className="note-title">{t[id].noteTitle}</div>{t[id].notes.map(([k, v]) => <div className="note-row" key={k}><span className="k">{k}</span><span className="v">{v}</span></div>)}</div>
        </div>
      </section>)}
      <section className="section" id="faq"><Heading section={t.faq} /><div className="faq-list">{t.faq.items.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}</summary><div className="answer">{a}</div></details>)}</div></section>
    </div>
    <footer><div className="container">
      <div className="disclaimer">{t.footer.disclaimer}</div><div className="footer-brand">VidSaveNow</div><div className="footer-tag">{t.footer.tag}</div>
      <FooterLinks locale={locale} labels={t.footer} />
      <div className="footer-copy">© {new Date().getFullYear()} VidSaveNow</div>
    </div></footer>
  </>;
}
