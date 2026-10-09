import { platformPath, languageAlternates, openGraphLocales } from './locales.mjs';

export function looksLikeX(raw) {
  try {
    const url = new URL(String(raw).trim());
    return url.protocol === 'https:' && !url.username && !url.password && !url.port
      && /^(?:www\.|mobile\.|m\.)?(?:x|twitter)\.com$/i.test(url.hostname)
      && /^\/(?:[A-Za-z0-9_]+|i\/web)\/status\/\d{2,20}(?:\/(?:video|photo)\/\d+)?\/?$/.test(url.pathname);
  } catch { return false; }
}

export const X_DICT = {
  zh: {
    metaTitle: 'Free Online Video Downloader-X.com',
    metaDesc: 'VidSaveNow 是免费的 X / Twitter 视频在线下载工具：粘贴公开帖子链接，选择源视频清晰度并保存 MP4。支持手机、电脑及同一帖子的多个视频，无需登录或安装。',
    keywords: ['VidSaveNow', 'X视频下载', 'Twitter视频下载', 'X在线下载', 'Twitter怎么下载', 'Twitter MP4', '手机Twitter视频下载', '电脑X视频下载', 'Twitter GIF下载'],
    altLocale: { href: '/x/en', label: 'EN' },
    nav: { downloader: '下载工具', howto: '怎么下载', faq: '常见问题' },
    hero: {
      h1: 'X / Twitter 视频在线下载', sub: '下载公开帖子的 MP4 视频。免费、原始画质、无需登录。',
      placeholder: '粘贴 X / Twitter 视频链接', paste: '粘贴', download: '下载视频', parsing: '解析中…',
      trust: '无需登录 · 原始画质 · MP4 · 免费', hint: '支持 x.com 与 twitter.com 公开帖子链接',
      stValid: '✓ 已识别 X / Twitter 帖子链接', stInvalid: '请输入有效的 X / Twitter 帖子链接',
      stLoading: '正在获取视频信息…', stSuccess: '视频解析完成', stEmpty: '请先粘贴 X / Twitter 视频链接',
      stPasteFail: '无法读取剪贴板，请长按输入框手动粘贴', stCopyFail: '复制失败，请手动选择复制',
      stNetFail: '网络异常，请检查网络后重试', stFail: '解析失败，请确认帖子可以公开访问后重试', stTimeout: '解析超时，请稍后重试',
    },
    loading: { title: '正在解析视频…', steps: ['获取帖子信息', '获取视频资源', '准备下载'] },
    result: {
      unknownAuthor: '未知作者', copyInfo: '复制视频信息', copied: '✓ 已复制', untitled: '(无标题)',
      infoAuthor: '作者：', infoDuration: '时长：', primaryCta: '下载最佳画质 · MP4', primarySub: '推荐 · 源视频最佳版本',
      secondaryCta: '下载 MP4', secondarySub: '其他清晰度', moreHead: '更多清晰度',
      downloading: '正在下载', saved: '视频已保存', cancel: '取消下载', progress: '下载进度',
    },
    intro: {
      eyebrow: '免费在线工具', h2: '在线下载 X / Twitter 视频',
      p1: 'VidSaveNow 是一款在浏览器中使用的免费 X / Twitter 视频下载工具。粘贴公开帖子链接，即可获取视频封面、作者和标题，选择帖子提供的清晰度并保存为 MP4。同一帖子的多个视频会分别列出，GIF 动画也可保存为 MP4。',
      p2: '无需安装软件、浏览器扩展或登录 X 账号。仅支持公开、可直接下载的 MP4 视频，不支持私密帖子、直播或分段流。请仅保存自己拥有版权或已获授权的内容，并遵守平台条款。',
    },
    why: { eyebrow: '产品能力', h2: '为什么选择 VidSaveNow', items: [
      ['多个视频', '同一帖子的多个视频分别列出，可独立保存。'],
      ['原始画质', '提供源视频已有的 MP4 清晰度，不做二次压制。'],
      ['免费使用', '无需注册或付费，在线解析公开视频。'],
      ['无需登录', '不索取 X 账号、邮箱、密码或登录凭证。'],
    ] },
    howto: { eyebrow: '图文步骤', h2: '怎么下载 X / Twitter 视频', steps: [
      ['打开 X / Twitter', '在 X App 或 x.com 网页中打开想保存的公开视频帖子。'],
      ['复制链接', '点击分享并复制帖子链接；网页端可复制地址栏 URL。'],
      ['粘贴并下载', '将帖子链接粘贴到上方输入框，点击「下载视频」获取视频信息。'],
      ['保存文件', '选择最佳画质 MP4 或其他清晰度，将视频保存到你的设备。'],
    ] },
    mobile: { eyebrow: '手机端', h2: '手机上怎么下载 X / Twitter 视频', points: [
      '用 Safari、Chrome 等手机浏览器打开本页，无需安装 App 或扩展。',
      '从 X App 复制帖子链接，回到本页粘贴并获取视频。',
      '选择 MP4 清晰度后，等待下载完成，再在浏览器的下载记录中查看。',
      '同一帖子有多个视频时，可以逐个选择并保存。',
    ], noteTitle: '文件保存位置', notes: [['iPhone / iPad', '文件 App 的下载目录'], ['Android', '浏览器下载目录']] },
    pc: { eyebrow: '电脑端', h2: '电脑上怎么下载 X / Twitter 视频', points: [
      'Chrome、Edge、Safari 和 Firefox 均可使用，无需安装软件。',
      '复制公开帖子的地址，粘贴后获取 MP4 视频清晰度。',
      '支持的 Chrome 和 Edge 浏览器可选择位置，直接写入文件，避免占用大量内存。',
      '其他浏览器保存至默认下载目录；内存下载上限为 256 MB。',
    ], noteTitle: '小提示', notes: [['支持浏览器', 'Chrome · Edge · Safari · Firefox'], ['大文件', '推荐电脑 Chrome 或 Edge']] },
    faq: { eyebrow: '常见问题', h2: '常见问题解答', items: [
      ['如何下载 X / Twitter 视频？', '复制公开帖子链接，粘贴到上方输入框并点击「下载视频」。解析后选择最佳画质 MP4 或其他清晰度即可保存。'],
      ['iPhone 上怎么下载 Twitter 视频？', '在 X App 中复制帖子链接，用 Safari 或 Chrome 打开本页，粘贴链接并下载。下载完成后，在文件 App 的下载目录中查看 MP4，需要时再分享至照片。'],
      ['安卓手机怎么下载 X 视频？', '从 X App 复制公开帖子链接，回到本页粘贴并下载，MP4 保存在浏览器的下载目录。'],
      ['电脑上怎么下载 Twitter 视频？', '复制 x.com 或 twitter.com 帖子地址，粘贴到本页并下载。支持的 Chrome 和 Edge 可选择保存位置；其他浏览器使用默认下载目录。'],
      ['需要登录 X 账号吗？', '不需要。本工具不索取登录凭证，只支持可公开访问的帖子。私密内容或需要登录才能查看的内容不支持。'],
      ['可以下载多个视频和 GIF 吗？', '可以，同一帖子的多个视频分别显示并独立下载。X 的 GIF 动画以 MP4 格式保存。'],
      ['能下载什么清晰度？', '提供帖子已有的 MP4 清晰度，最佳画质按钮使用最高码率版本。画质取决于原始视频，不会将低清视频放大成高清。'],
      ['为什么解析或下载失败？', '帖子可能已删除、设为私密或需要登录，也可能是 X 或解析服务暂时限制请求。请确认原帖可以公开访问，核对链接后稍后重试。直播、音频提取和分段视频暂不支持。'],
      ['文件较大时怎么下载？', '支持的电脑 Chrome 或 Edge 可直接写入所选文件夹。其他浏览器的内存下载上限为 256 MB，更大的文件请改用电脑浏览器。'],
    ] },
    footer: { disclaimer: '免责声明：本工具仅供保存你拥有版权或已获授权的内容。请尊重创作者权利，遵守 X 平台条款，不要擅自转载或商用他人视频。', tag: 'X / Twitter 视频在线下载工具', privacy: '隐私政策', terms: '服务条款', contact: '版权投诉' },
  },
  en: {
    metaTitle: 'Free Online Video Downloader-X.com',
    metaDesc: 'VidSaveNow is a free X / Twitter video downloader. Paste a public post link, choose an available quality and save MP4 videos on mobile or desktop. Supports multiple videos without login or installation.',
    keywords: ['VidSaveNow', 'X video downloader', 'Twitter video downloader', 'download Twitter videos online', 'how to download X videos', 'Twitter MP4', 'Twitter video downloader iPhone', 'download Twitter videos on PC', 'Twitter GIF downloader'],
    altLocale: { href: '/x', label: '中文' }, nav: { downloader: 'Downloader', howto: 'How to Download', faq: 'FAQ' },
    hero: {
      h1: 'X / Twitter Video Downloader', sub: 'Download public post videos in MP4. Free, original quality, no login required.',
      placeholder: 'Paste X / Twitter video link', paste: 'Paste', download: 'Download', parsing: 'Parsing…',
      trust: 'No login · Original quality · MP4 · Free', hint: 'Supports public post links from x.com and twitter.com',
      stValid: '✓ X / Twitter post link recognized', stInvalid: 'Please enter a valid X / Twitter post link',
      stLoading: 'Fetching video info…', stSuccess: 'Video parsed successfully', stEmpty: 'Please paste an X / Twitter video link first',
      stPasteFail: 'Cannot read clipboard. Please paste into the field manually.', stCopyFail: 'Copy failed. Please select and copy manually.',
      stNetFail: 'Network error. Check your connection and retry.', stFail: 'Parsing failed. Check that the post is public and retry.', stTimeout: 'Parsing timed out. Please try again later.',
    },
    loading: { title: 'Parsing video…', steps: ['Fetching post info', 'Locating video sources', 'Preparing download'] },
    result: {
      unknownAuthor: 'Unknown creator', copyInfo: 'Copy video info', copied: '✓ Copied', untitled: '(untitled)',
      infoAuthor: 'Creator: ', infoDuration: 'Duration: ', primaryCta: 'Download Best Quality · MP4', primarySub: 'Recommended · Best available source',
      secondaryCta: 'Download MP4', secondarySub: 'Alternative quality', moreHead: 'More qualities',
      downloading: 'Downloading', saved: 'Video saved', cancel: 'Cancel download', progress: 'Download progress',
    },
    intro: { eyebrow: 'Free online tool', h2: 'Download X / Twitter Videos Online',
      p1: 'VidSaveNow is a free X / Twitter video downloader that works in your browser. Paste a public post link to get the cover, creator and title, then choose an available quality and save the video as MP4. Multiple videos in a post are listed separately, and GIF animations can also be saved as MP4.',
      p2: 'No software, browser extension or X login is required. Only public, directly downloadable MP4 videos are supported, not private posts, live streams or segmented video. Save content you own or are authorized to reuse and respect the platform terms.',
    },
    why: { eyebrow: 'Benefits', h2: 'Why VidSaveNow', items: [
      ['Multiple videos', 'Videos in the same post are listed separately for individual downloads.'],
      ['Original quality', 'Choose an MP4 quality provided by the source without re-encoding.'],
      ['Free to use', 'Download public videos online without signing up or paying.'],
      ['No login', 'We never ask for your X account, email, password or login credentials.'],
    ] },
    howto: { eyebrow: 'Step by step', h2: 'How to Download X / Twitter Videos', steps: [
      ['Open X / Twitter', 'Open the public video post in the X app or on x.com.'],
      ['Copy the link', 'Use Share to copy the post link, or copy the URL from your browser address bar.'],
      ['Paste & download', 'Paste the post link into the box above and press Download to fetch video info.'],
      ['Save your file', 'Choose the best available MP4 or an alternative quality and save it to your device.'],
    ] },
    mobile: { eyebrow: 'On your phone', h2: 'Download X / Twitter Videos on Mobile', points: [
      'Open this page in Safari, Chrome or another mobile browser without an app or extension.',
      'Copy the post link in the X app, then paste it here to fetch the video.',
      'Choose an MP4 quality, wait for the download to finish and check your browser downloads.',
      'If a post has multiple videos, choose and save them individually.',
    ], noteTitle: 'Where files save', notes: [['iPhone / iPad', 'Downloads in the Files app'], ['Android', 'Browser downloads folder']] },
    pc: { eyebrow: 'On your computer', h2: 'Download X / Twitter Videos on PC', points: [
      'Works in Chrome, Edge, Safari and Firefox without installing software.',
      'Copy a public post URL and paste it here to get the available MP4 qualities.',
      'Supported Chrome and Edge browsers let you choose a location and write directly to disk.',
      'Other browsers use your default downloads folder with a 256 MB memory download limit.',
    ], noteTitle: 'Good to know', notes: [['Browsers', 'Chrome · Edge · Safari · Firefox'], ['Large files', 'Desktop Chrome or Edge recommended']] },
    faq: { eyebrow: 'FAQ', h2: 'Frequently Asked Questions', items: [
      ['How do I download an X / Twitter video?', 'Copy a public post link, paste it above and press Download. Choose the best available MP4 or another quality to save the video.'],
      ['How do I download Twitter videos on iPhone?', 'Copy the post link in the X app, open this page in Safari or Chrome, paste the link and download. Find the MP4 in Downloads in the Files app, then share it to Photos if needed.'],
      ['How do I download X videos on Android?', 'Copy a public post link from the X app, paste it here and download. The MP4 is saved in your browser downloads folder.'],
      ['How do I download Twitter videos on PC or Mac?', 'Copy an x.com or twitter.com post URL and paste it here. Supported Chrome and Edge browsers let you choose a save location; other browsers use the default downloads folder.'],
      ['Do I need to log in to X?', 'No. We do not ask for login credentials and only support publicly accessible posts. Private content and posts requiring login are not supported.'],
      ['Can I download multiple videos and GIFs?', 'Yes. Multiple videos in a post are displayed separately and downloaded individually. X GIF animations are saved as MP4 files.'],
      ['What quality can I download?', 'Choose from the MP4 qualities provided by the post. The best-quality button uses the highest-bitrate version. Quality depends on the original video; low-resolution videos are not upscaled.'],
      ['Why does parsing or downloading fail?', 'The post may be deleted, private or require login, or X or the parsing provider may temporarily limit requests. Check that the original post is public and try again later. Live streams, audio extraction and segmented video are not supported.'],
      ['How do I download large files?', 'Supported desktop Chrome and Edge browsers can write directly to your chosen folder. Other browsers have a 256 MB memory download limit. Use a desktop browser for larger videos.'],
    ] },
    footer: { disclaimer: 'Disclaimer: Save only content you own or are authorized to reuse. Respect creators and X platform terms, and do not republish or commercially use others’ videos without permission.', tag: 'X / Twitter Video Downloader', privacy: 'Privacy', terms: 'Terms', contact: 'Contact' },
  },
  ja: {
    locale: 'ja',
    metaTitle: 'Free Online Video Downloader-X.com',
    metaDesc: 'VidSaveNow は無料の X / Twitter 動画ダウンロードツールです。公開ポストのリンクを貼り付け、元の動画で利用できる画質を選んで MP4 を保存。スマートフォンとパソコンで使え、同じポストの複数動画にも対応。ログインやインストールは不要です。',
    keywords: ['VidSaveNow', 'X 動画ダウンロード', 'Twitter 動画ダウンロード', 'X 動画オンライン保存', 'Twitter 動画の保存方法', 'Twitter MP4 ダウンロード', 'iPhone Twitter 動画保存', 'パソコン X 動画保存', 'Twitter GIF ダウンロード'],
    altLocale: { href: '/x/en', label: 'English' },
    nav: { downloader: 'ダウンロード', howto: '保存方法', faq: 'よくある質問' },
    hero: {
      h1: 'X / Twitter 動画保存', sub: '公開ポストの動画を元の画質の MP4 で保存。無料で使えて、ログインも不要です。',
      placeholder: 'X / Twitter 動画のリンクを貼り付け', paste: '貼り付け', download: 'ダウンロード', parsing: '解析中…',
      trust: 'ログイン不要 · 元の画質 · MP4 · 無料で利用', hint: 'x.com と twitter.com の公開ポストのリンクに対応しています',
      stValid: '✓ X / Twitter のポストのリンクを確認しました', stInvalid: '有効な X / Twitter のポストのリンクを入力してください',
      stLoading: '動画情報を取得しています…', stSuccess: '動画の解析が完了しました', stEmpty: 'まず X / Twitter 動画のリンクを貼り付けてください',
      stPasteFail: 'クリップボードを読み取れません。入力欄に手動で貼り付けてください', stCopyFail: 'コピーできませんでした。文字を選択して手動でコピーしてください',
      stNetFail: '通信エラーです。接続を確認して、もう一度お試しください', stFail: '解析できませんでした。ポストが公開されていることを確認して再試行してください', stTimeout: '解析がタイムアウトしました。時間をおいてお試しください',
    },
    loading: { title: '動画を解析しています…', steps: ['ポストの情報を取得しています', '動画を探しています', 'ダウンロードを準備しています'] },
    result: {
      unknownAuthor: '投稿者が不明です', copyInfo: '動画情報をコピー', copied: '✓ コピーしました', untitled: '(タイトルなし)',
      infoAuthor: '投稿者の名前: ', infoDuration: '動画の長さ: ', primaryCta: '最良の画質で保存 · MP4', primarySub: 'おすすめ · 元の動画の最良の画質',
      secondaryCta: 'MP4 をダウンロード', secondarySub: 'その他の画質', moreHead: 'その他の画質を選ぶ',
      downloading: 'ダウンロード中', saved: '動画を保存しました', cancel: 'ダウンロードを中止', progress: 'ダウンロードの進行状況',
    },
    intro: {
      eyebrow: '無料のオンラインツール', h2: 'X / Twitter 動画をオンライン保存',
      p1: 'VidSaveNow はブラウザーで使える無料の X / Twitter 動画ダウンロードツールです。公開ポストのリンクを貼り付けると、カバー画像、投稿者、タイトルを確認し、利用できる画質を選んで MP4 として保存できます。同じポストの複数動画は個別に表示され、GIF アニメーションも MP4 で保存できます。',
      p2: 'ソフトウェアやブラウザー拡張機能のインストール、X へのログインは不要です。公開されている、直接ダウンロード可能な MP4 動画のみ対応しています。非公開ポスト、ライブ配信、分割配信の動画には対応していません。ご自身が権利を持つ動画や利用許可を得た動画のみ保存し、プラットフォームの利用規約を守ってください。',
    },
    why: { eyebrow: '選ばれる理由', h2: 'VidSaveNow が選ばれる理由', items: [
      ['複数の動画に対応', '同じポストにある動画は個別に表示され、それぞれ保存できます。'],
      ['元の画質で保存', '配信元が提供する MP4 の画質を選べます。再エンコードは行いません。'],
      ['無料で利用', '登録や料金の支払いなしで、公開動画をオンラインで保存できます。'],
      ['ログイン不要', 'X アカウント、メールアドレス、パスワードなどのログイン情報は求めません。'],
    ] },
    howto: { eyebrow: '保存の手順', h2: 'X / Twitter 動画の保存方法', steps: [
      ['X / Twitter を開く', 'X アプリまたは x.com で、保存したい公開動画のポストを開きます。'],
      ['リンクをコピー', '共有メニューからポストのリンクをコピーします。ブラウザーではアドレスバーの URL をコピーできます。'],
      ['貼り付けてダウンロード', '上の入力欄にポストのリンクを貼り付け、「ダウンロード」を押して動画情報を取得します。'],
      ['ファイルを保存', '利用できる最良の画質の MP4 または別の画質を選び、端末に保存します。'],
    ] },
    mobile: { eyebrow: 'スマートフォンで保存', h2: 'スマートフォンで X / Twitter 動画を保存', points: [
      'Safari や Chrome などのスマートフォンのブラウザーで本ページを開きます。アプリや拡張機能の追加は不要です。',
      'X アプリでポストのリンクをコピーし、本ページに貼り付けて動画を取得します。',
      'MP4 の画質を選んでダウンロードの完了を待ち、ブラウザーのダウンロード履歴を確認します。',
      '同じポストに複数の動画がある場合は、個別に選んで保存できます。',
    ], noteTitle: 'ファイルの保存先', notes: [['iPhone / iPad', 'ファイルアプリのダウンロードフォルダー'], ['Android', 'ブラウザーのダウンロードフォルダー']] },
    pc: { eyebrow: 'パソコンで保存', h2: 'パソコンで X / Twitter 動画を保存', points: [
      'Chrome、Edge、Safari、Firefox に対応しています。ソフトウェアのインストールは不要です。',
      '公開ポストの URL をコピーして貼り付けると、利用できる MP4 の画質が表示されます。',
      '対応する Chrome や Edge では保存先を選び、ファイルをディスクに直接書き込めます。',
      'その他のブラウザーでは標準のダウンロードフォルダーに保存されます。メモリを使うダウンロードの上限は 256 MB です。',
    ], noteTitle: '保存時のヒント', notes: [['対応ブラウザー', 'Chrome · Edge · Safari · Firefox'], ['大きなファイル', 'パソコンの Chrome または Edge を推奨']] },
    faq: { eyebrow: 'よくある質問', h2: 'よくある質問と回答', items: [
      ['X / Twitter 動画を保存するには？', '公開ポストのリンクをコピーして上の入力欄に貼り付け、「ダウンロード」を押します。解析後、利用できる最良の画質の MP4 または別の画質を選んで保存します。'],
      ['iPhone で Twitter 動画を保存するには？', 'X アプリでポストのリンクをコピーし、Safari または Chrome で本ページを開いて貼り付け、ダウンロードします。MP4 はファイルアプリのダウンロードフォルダーに保存されます。必要に応じて写真アプリに共有してください。'],
      ['Android で X 動画を保存するには？', 'X アプリで公開ポストのリンクをコピーし、本ページに貼り付けてダウンロードします。MP4 はブラウザーのダウンロードフォルダーに保存されます。'],
      ['パソコンや Mac で Twitter 動画を保存するには？', 'x.com または twitter.com のポストの URL をコピーして本ページに貼り付けます。対応する Chrome や Edge では保存先を選べます。その他のブラウザーでは標準のダウンロードフォルダーに保存されます。'],
      ['X へのログインは必要ですか？', '必要ありません。ログイン情報は求めず、公開されているポストのみ対応しています。非公開のコンテンツやログインしないと見られないポストには対応していません。'],
      ['複数の動画や GIF を保存できますか？', 'はい。同じポストの複数動画は個別に表示され、それぞれダウンロードできます。X の GIF アニメーションは MP4 ファイルとして保存されます。'],
      ['どの画質で保存できますか？', 'ポストが提供する MP4 の画質から選べます。最良の画質のボタンはビットレートが最も高い動画を使います。画質は元の動画によって決まり、低解像度の動画を高解像度に拡大することはありません。'],
      ['解析やダウンロードに失敗するのはなぜですか？', 'ポストが削除された、非公開になった、ログインが必要になった、または X や解析サービスが一時的にリクエストを制限している可能性があります。元のポストが公開されていることを確認し、時間をおいてお試しください。ライブ配信、音声の抽出、分割配信の動画には対応していません。'],
      ['大きなファイルを保存するには？', '対応するパソコンの Chrome や Edge では、選んだフォルダーに直接書き込めます。その他のブラウザーではメモリを使うダウンロードの上限が 256 MB です。それより大きな動画にはパソコンの対応ブラウザーをご利用ください。'],
    ] },
    footer: { disclaimer: '免責事項: ご自身が権利を持つコンテンツ、または利用許可を得たコンテンツのみ保存してください。投稿者の権利を尊重し、X の利用規約を守り、他人の動画を許可なく再投稿したり商用利用したりしないでください。', tag: 'X / Twitter 動画ダウンロード', privacy: 'プライバシー', terms: '利用規約', contact: 'お問い合わせ' },
  },
};

export function xMetadata(locale) {
  const t = X_DICT[locale];
  const canonical = platformPath('x', locale);
  return {
    title: t.metaTitle, description: t.metaDesc, keywords: t.keywords,
    alternates: { canonical, languages: languageAlternates('x') },
    authors: [{ name: 'VidSaveNow', url: process.env.SITE_URL || 'https://www.vidsavenow.com' }],
    creator: 'VidSaveNow', publisher: 'VidSaveNow', category: 'technology',
    openGraph: { type: 'website', url: canonical, title: t.metaTitle, description: t.metaDesc, siteName: 'VidSaveNow',
      ...openGraphLocales(locale),
      images: [{ url: '/x/social-image', width: 1200, height: 630, alt: 'VidSaveNow - X / Twitter Video Downloader' }] },
    twitter: { card: 'summary_large_image', title: t.metaTitle, description: t.metaDesc, images: ['/x/social-image'] },
  };
}

export function xFaqJsonLd(locale) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: X_DICT[locale].faq.items.map(([name, text]) => ({
    '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text },
  })) };
}
