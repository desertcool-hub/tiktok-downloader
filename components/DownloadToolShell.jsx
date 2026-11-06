import Link from 'next/link';
import { Download } from 'lucide-react';
import styles from './DownloadTools.module.css';

export default function DownloadToolShell({ platform, title, description, faq = [], children }) {
  return (
    <div className={styles.page} data-platform={platform}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link className={styles.brand} href="/"><Download size={21} aria-hidden="true" />VidSaveNow</Link>
          <nav className={styles.links} aria-label="下载平台">
            <Link href="/zh">TikTok</Link>
            <Link href="/weixin" aria-current={platform === 'weixin' ? 'page' : undefined}>微信视频号</Link>
            <Link href="/x" aria-current={platform === 'x' ? 'page' : undefined}>X / Twitter</Link>
            <Link href="/youtube" aria-current={platform === 'youtube' ? 'page' : undefined}>YouTube</Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <h1 className={styles.heading}>{title}</h1>
        <p className={styles.lead}>{description}</p>
        {children}
        <section className={styles.faq} aria-label="常见问题">
          <h2>常见问题</h2>
          {faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </section>
      </main>
      <footer className={styles.footer}>
        <div><Link href="/zh">TikTok</Link><Link href="/weixin">微信视频号</Link><Link href="/x">X / Twitter</Link><Link href="/youtube">YouTube</Link></div>
        <p>仅保存你拥有版权或已获授权的内容。VidSaveNow 与上述平台无关联。</p>
      </footer>
    </div>
  );
}
