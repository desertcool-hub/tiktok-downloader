import { LOCALES, openGraphLocales } from './locales.mjs';
import { DOCUMENT_TRANSLATIONS } from './translations/index.mjs';

export const SITE_DOCUMENTS = ['privacy', 'terms', 'contact'];
export const SITE_CONTACT_EMAIL = 'desertcool@gmail.com';
export const DOCUMENT_UPDATED = '2026-10-14';

const SOURCE_LABELS = {
  en: 'Vercel Web Analytics privacy details', zh: 'Vercel 访问统计的隐私说明', ja: 'Vercel アクセス統計のプライバシー',
  id: 'Privasi Vercel Web Analytics', es: 'Privacidad de Vercel Web Analytics',
  pt: 'Privacidade do Vercel Web Analytics', vi: 'Quyền riêng tư của Vercel Web Analytics',
};

const COPY = {
  ...DOCUMENT_TRANSLATIONS,
  en: {
    updated: 'Last updated', home: 'Back to downloader', language: 'Language', email: 'Email VidSaveNow',
    privacy: {
      title: 'Privacy Policy', description: 'How VidSaveNow processes video links, technical information and website analytics.',
      sections: [
        { title: 'Information we process', paragraphs: ['VidSaveNow processes the public post links you submit, video metadata and media needed to respond to your download request. You do not need a VidSaveNow account, and we do not ask for social-platform passwords or login cookies. Do not submit private links, credentials or sensitive information.'] },
        { title: 'Hosting and analytics', paragraphs: ['The site is hosted on Vercel and includes Vercel Web Analytics for aggregate traffic statistics such as page views, referrers, device information and approximate location. This analytics service does not use third-party tracking cookies. Hosting and security systems may separately process IP addresses and request information.'] },
        { title: 'Third-party services', paragraphs: ['Depending on the platform, requests may be sent to the source platform, its media CDN or parsing services such as TikWM and FxEmbed. Loading a cover or preview may also contact a third-party host. These services have their own privacy and retention practices; our policy does not govern their systems.'] },
        { title: 'Temporary processing and retention', paragraphs: ['Some downloads are streamed; others use temporary files during processing. VidSaveNow does not provide a saved personal download-history account. Diagnostic logs may include request details, submitted URLs or upstream errors. We do not promise that hosting logs, provider records or email correspondence are immediately deleted; retention depends on the service and the support or security need.'] },
        { title: 'Your choices and questions', paragraphs: ['Only submit content you are comfortable sending to the services described above. Your browser settings or content blockers may limit analytics and third-party requests. Contact the email below for privacy questions or a request relating to information you have supplied. Do not include passwords, cookies or signed download URLs.'] },
      ],
    },
    terms: {
      title: 'Terms of Use', description: 'Conditions for using VidSaveNow, authorized downloads and reporting concerns.',
      sections: [
        { title: 'About the service', paragraphs: ['VidSaveNow provides tools for parsing and downloading supported public video posts. It is an independent service and is not affiliated with or endorsed by TikTok, X, YouTube or other source platforms. These terms apply to your use of this website.'] },
        { title: 'Content permissions', paragraphs: ['Download only content you own or have permission to download and use. You remain responsible for respecting copyright, privacy, applicable law and source-platform terms. Public availability does not itself grant permission to download, republish or use a video commercially. VidSaveNow does not transfer any rights in third-party content.'] },
        { title: 'Acceptable use', paragraphs: ['Do not use the service to access private or login-restricted material, bypass access controls, infringe others’ rights, or distribute harmful content. Do not overload the service, evade rate limits or misuse the download endpoints. Access may be restricted to protect the service and other users.'] },
        { title: 'Availability and limits', paragraphs: ['Downloads depend on source availability, upstream access and the supported formats. Links can expire, and a request can fail or exceed a displayed file or time limit. Features and limits may change. No particular download, quality, uninterrupted availability or suitability for a specific purpose is guaranteed; any mandatory protections under applicable law remain unaffected.'] },
        { title: 'Reports and updates', paragraphs: ['Send technical issues, privacy concerns or rights-related reports to the contact email below. Include the relevant source URL, a description and information that allows us to understand your concern. We may update these terms as the service changes; the revision date is shown above.'] },
      ],
    },
    contact: {
      title: 'Contact', description: 'Contact VidSaveNow for support, feedback, privacy questions and copyright concerns.',
      sections: [
        { title: 'Support and feedback', paragraphs: ['Email VidSaveNow using the address below. For a download problem, include the platform, public post URL, approximate time, browser and the error message. You may attach a screenshot with personal information removed.'] },
        { title: 'Copyright and privacy concerns', paragraphs: ['Include the relevant URL, the issue you are reporting, your connection to the affected content or information, and a reply address. Please send only the information needed to assess the report.'] },
        { title: 'Keep your credentials private', paragraphs: ['Never email passwords, API keys, login cookies or complete signed download links. This page opens your email app; it does not submit a form or automatically send a message. We do not promise a fixed response time.'] },
      ],
    },
  },
  zh: {
    updated: '更新日期', home: '返回下载工具', language: '语言', email: '联系 VidSaveNow',
    privacy: {
      title: '隐私政策', description: '了解 VidSaveNow 如何处理视频链接、技术信息和访问统计。',
      sections: [
        { title: '我们处理的信息', paragraphs: ['VidSaveNow 会处理你提交的公开帖子链接，以及完成下载所需的视频信息和媒体数据。使用本站不需要注册 VidSaveNow 账号，我们不会要求提供社交平台密码或登录 Cookie。请勿提交私密链接、登录凭据或敏感信息。'] },
        { title: '托管与访问统计', paragraphs: ['本站托管于 Vercel，并接入 Vercel Web Analytics，用于汇总页面访问、来源、设备和大致地区等统计。该统计服务不使用第三方跟踪 Cookie。托管与安全系统可能另外处理 IP 地址和请求信息。'] },
        { title: '第三方服务', paragraphs: ['根据下载平台，请求可能发送至原平台、媒体 CDN，或 TikWM、FxEmbed 等解析服务。加载封面或预览也可能访问第三方服务器。这些服务有各自的隐私和保留规则，本政策不适用于其独立系统。'] },
        { title: '临时处理与保留', paragraphs: ['部分下载以流式方式传输，部分下载会在处理过程中使用临时文件。本站不提供个人下载历史账号。诊断日志可能包含请求信息、提交的链接或上游错误。我们不承诺托管日志、第三方记录或邮件往来立即删除；保留情况取决于对应服务及支持、安全需要。'] },
        { title: '你的选择与联系', paragraphs: ['请只提交你愿意发送给上述服务的内容。浏览器设置或内容拦截工具可能限制统计和第三方请求。如有隐私问题，或需要提出与你提交信息有关的请求，请使用下方邮箱联系。请勿发送密码、Cookie 或完整的签名下载链接。'] },
      ],
    },
    terms: {
      title: '使用条款', description: 'VidSaveNow 的使用条件、内容授权要求及问题反馈方式。',
      sections: [
        { title: '关于服务', paragraphs: ['VidSaveNow 提供受支持的公开视频帖子解析与下载工具。本站为独立服务，与 TikTok、X、YouTube 等原平台无隶属或认可关系。本条款适用于你对本站的使用。'] },
        { title: '内容与授权', paragraphs: ['请仅下载你拥有权利或已取得下载和使用许可的内容。你需要自行遵守版权、隐私、适用法律及原平台条款。内容公开可见并不代表你可以下载、转载或商用。VidSaveNow 不向你转让第三方内容的任何权利。'] },
        { title: '合理使用', paragraphs: ['请勿使用本站获取私密或需要登录的内容、绕过访问控制、侵犯他人权利或传播有害内容。请勿过量请求、规避限流或滥用下载接口。为保护服务和其他用户，本站可能限制访问。'] },
        { title: '可用性与限制', paragraphs: ['下载取决于原内容是否可用、上游访问情况及支持的格式。链接可能过期，请求可能失败，或超过页面显示的文件与时长限制。功能和限制可能调整。本站不保证特定下载、画质、持续可用性或特定用途的适用性；适用法律规定的强制性保护不受影响。'] },
        { title: '反馈与更新', paragraphs: ['技术问题、隐私问题或权利相关投诉，请发送至下方联系邮箱，并提供相关原链接、问题说明和便于核查的信息。本站可能随服务调整更新条款，修订日期显示在页面顶部。'] },
      ],
    },
    contact: {
      title: '联系我们', description: '联系 VidSaveNow，反馈下载问题、隐私疑问或版权相关事项。',
      sections: [
        { title: '支持与建议', paragraphs: ['请使用下方邮箱联系 VidSaveNow。反馈下载问题时，可提供平台、公开帖子链接、发生时间、浏览器及错误提示。截图请先遮盖个人信息。'] },
        { title: '版权与隐私事项', paragraphs: ['请提供相关链接、问题说明、你与相关内容或信息的关系，以及可回复的联系方式。只发送核查问题所必需的信息。'] },
        { title: '保护你的凭据', paragraphs: ['请勿通过邮件发送密码、API 密钥、登录 Cookie 或完整的签名下载链接。页面上的邮箱链接会打开你的邮件应用，不会提交表单或自动发送邮件。本站不承诺固定回复时限。'] },
      ],
    },
  },
  ja: {
    updated: '更新日', home: 'ダウンロードツールに戻る', language: '言語', email: 'VidSaveNow に連絡',
    privacy: {
      title: 'プライバシーポリシー', description: 'VidSaveNow における動画リンク、技術情報、アクセス統計の取り扱い。',
      sections: [
        { title: '取り扱う情報', paragraphs: ['VidSaveNow は、入力された公開投稿のリンクと、ダウンロードに必要な動画情報およびメディアを処理します。VidSaveNow のアカウント登録は不要です。SNS のパスワードやログイン Cookie は求めません。非公開リンク、認証情報、機密情報を送信しないでください。'] },
        { title: 'ホスティングとアクセス統計', paragraphs: ['本サイトは Vercel でホストされ、Vercel Web Analytics によりページ閲覧、参照元、端末、おおよその地域などの集計統計を取得します。この統計サービスは第三者の追跡 Cookie を使用しません。ホスティングおよびセキュリティのシステムは、別途 IP アドレスやリクエスト情報を処理する場合があります。'] },
        { title: '第三者サービス', paragraphs: ['対象プラットフォームに応じて、元のプラットフォーム、メディア CDN、TikWM、FxEmbed などの解析サービスにリクエストを送信する場合があります。サムネイルやプレビューの読み込みにも第三者サーバーを利用する場合があります。各サービスの情報処理と保存には、それぞれのポリシーが適用されます。'] },
        { title: '一時処理と保存', paragraphs: ['一部のダウンロードはストリーミングで転送され、その他は処理中に一時ファイルを使用します。本サイトは個人のダウンロード履歴アカウントを提供しません。診断ログにはリクエスト、入力リンク、上流サービスのエラーが含まれる場合があります。ホスティングログ、第三者の記録、メールの即時削除は保証しません。保存は各サービスおよびサポートや安全管理の必要性に依存します。'] },
        { title: '選択とお問い合わせ', paragraphs: ['上記のサービスへの送信に同意できる内容のみ入力してください。ブラウザー設定やコンテンツブロッカーにより、統計や第三者へのリクエストを制限できる場合があります。プライバシーや送信済み情報に関するご相談は、下記メールへご連絡ください。パスワード、Cookie、署名付きダウンロードリンク全体は送信しないでください。'] },
      ],
    },
    terms: {
      title: '利用規約', description: 'VidSaveNow の利用条件、コンテンツの許諾、問題の報告について。',
      sections: [
        { title: 'サービスについて', paragraphs: ['VidSaveNow は、対応する公開動画投稿の解析とダウンロードを提供する独立したサービスです。TikTok、X、YouTube などの元プラットフォームとは提携しておらず、承認を受けたサービスではありません。本規約は本サイトの利用に適用されます。'] },
        { title: 'コンテンツの権利', paragraphs: ['権利を所有するコンテンツ、またはダウンロードと利用の許可を得たコンテンツのみ保存してください。著作権、プライバシー、適用法、元プラットフォームの規約を守る責任は利用者にあります。公開されていることだけでは、ダウンロード、再公開、商用利用の許可にはなりません。第三者の権利を本サイトが譲渡することはありません。'] },
        { title: '適切な利用', paragraphs: ['非公開またはログイン制限のあるコンテンツの取得、アクセス制御の回避、権利侵害、有害なコンテンツの配布に使用しないでください。過剰なリクエスト、利用制限の回避、ダウンロード API の悪用は禁止します。サービスと他の利用者を保護するため、アクセスを制限する場合があります。'] },
        { title: '可用性と制限', paragraphs: ['ダウンロードは元コンテンツ、上流サービスへのアクセス、対応形式に依存します。リンクは期限切れとなる場合があり、処理の失敗や表示された容量・時間制限の超過もあります。機能と制限は変更される場合があります。特定のダウンロード、画質、継続的な可用性、特定用途への適合は保証しません。適用法による強制的な保護は影響を受けません。'] },
        { title: '報告と改定', paragraphs: ['技術的な問題、プライバシー、権利に関するご報告は、下記のメールアドレスへお送りください。元のリンク、問題の説明、確認に必要な情報を含めてください。サービスの変更に伴い本規約を改定する場合があり、改定日はページ上部に表示します。'] },
      ],
    },
    contact: {
      title: 'お問い合わせ', description: 'VidSaveNow のサポート、フィードバック、プライバシーと著作権に関するお問い合わせ。',
      sections: [
        { title: 'サポートとご意見', paragraphs: ['下記のメールアドレスから VidSaveNow にご連絡ください。ダウンロードの問題には、対象プラットフォーム、公開投稿のリンク、発生時刻、ブラウザー、エラー内容を含めてください。スクリーンショットの個人情報は隠してください。'] },
        { title: '著作権とプライバシー', paragraphs: ['関連リンク、問題の説明、対象コンテンツまたは情報との関係、返信先をお知らせください。確認に必要な情報のみ送信してください。'] },
        { title: '認証情報の保護', paragraphs: ['パスワード、API キー、ログイン Cookie、署名付きダウンロードリンク全体をメールで送信しないでください。メールリンクはお使いのメールアプリを開きます。フォーム送信や自動メール送信は行いません。一定の返信時間は保証しません。'] },
      ],
    },
  },
};

export function documentPath(document, locale = 'en') {
  if (!SITE_DOCUMENTS.includes(document)) throw new RangeError('Unknown site document');
  const code = LOCALES.some(item => item.code === locale) ? locale : 'en';
  return `/${document}${code === 'en' ? '' : `/${code}`}`;
}

export function documentCopy(document, locale = 'en') {
  documentPath(document, locale);
  const copy = COPY[locale] || COPY.en;
  return { ...copy[document], updated: copy.updated, home: copy.home, language: copy.language, email: copy.email,
    reference: SOURCE_LABELS[locale] || SOURCE_LABELS.en };
}

export function documentMetadata(document, locale = 'en') {
  const copy = documentCopy(document, locale);
  const canonical = documentPath(document, locale);
  const title = `${copy.title} | VidSaveNow`;
  return {
    title, description: copy.description,
    alternates: { canonical, languages: Object.fromEntries(LOCALES.map(item => [item.language, documentPath(document, item.code)])) },
    openGraph: { type: 'website', title, description: copy.description, url: canonical, siteName: 'VidSaveNow', ...openGraphLocales(locale) },
    twitter: { card: 'summary_large_image', title, description: copy.description },
  };
}
