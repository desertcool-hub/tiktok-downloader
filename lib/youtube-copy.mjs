import { platformPath, languageAlternates, openGraphLocales } from './locales.mjs';

export const YOUTUBE_DICT = {
  zh: {
    metaTitle: 'Free Online Video Downloader-youtube',
    metaDesc: 'VidSaveNow YouTube 视频在线下载工具：粘贴公开视频或 Shorts 链接，选择可用的原始画质 MP4（含声音）。当前试用仅支持最大 4 MB 的小文件，可在手机和电脑浏览器中使用。',
    keywords: ['VidSaveNow', 'YouTube视频下载', 'YouTube在线下载', 'YouTube Shorts下载', 'YouTube MP4', 'YouTube怎么下载', '手机YouTube视频下载', '电脑YouTube视频下载', 'YouTube小视频下载'],
    altLocale: { href: '/youtube/en', label: 'EN' },
    nav: { downloader: '下载工具', howto: '怎么下载', faq: '常见问题' },
    hero: {
      h1: 'YouTube 视频下载', sub: '保存公开视频与 Shorts，下载带声音的 MP4。试运行最大 4 MB。',
      placeholder: '粘贴 YouTube 视频链接', paste: '粘贴', download: '下载视频', parsing: '解析中…',
      trust: '原始可用画质 · MP4 含声音 · 最大 4 MB', hint: '支持 YouTube 视频与 Shorts 链接；服务可用性取决于 YouTube 的访问限制',
      stValid: '✓ 已识别 YouTube 视频链接', stInvalid: '请输入有效的 HTTPS YouTube 视频链接',
      stLoading: '正在获取视频信息…', stSuccess: '视频解析完成，请选择最大 4 MB 的可用 MP4', stEmpty: '请先粘贴 YouTube 视频链接',
      stPasteFail: '无法读取剪贴板，请长按输入框手动粘贴', stCopyFail: '复制失败，请手动选择复制',
      stNetFail: '网络异常，请检查网络后重试', stFail: '解析失败，请确认视频可以公开访问后稍后重试', stTimeout: '解析超时，请稍后重试',
    },
    loading: { title: '正在解析视频…', steps: ['获取视频信息', '查找含声音的 MP4', '准备下载'] },
    result: {
      unknownAuthor: '未知作者', copyInfo: '复制视频信息', copied: '✓ 已复制', untitled: '(无标题)',
      infoAuthor: '作者：', infoDuration: '时长：', primaryCta: '下载可用 MP4', primarySub: '原始画质 · 最大 4 MB',
      secondaryCta: '下载 MP4', secondarySub: '其他清晰度 · 最大 4 MB', moreHead: '更多清晰度',
      downloading: '正在下载', saved: '视频已保存', cancel: '取消下载', progress: '下载进度',
    },
    intro: {
      eyebrow: '在线工具', h2: '在线下载 YouTube 视频与 Shorts',
      p1: 'VidSaveNow 在浏览器中解析公开 YouTube 视频与 Shorts 链接，显示封面、作者、标题及可下载的 MP4 格式。仅提供原视频可用且包含声音的格式，不放大画质。当前为试用功能，文件最大 4 MB。',
      p2: '无需安装软件或浏览器扩展，也不索取 YouTube 登录凭证。私密、已删除、需要登录或仍在直播的视频可能无法下载；YouTube 的机器人验证也可能阻止解析。请仅保存你拥有版权或已获授权的内容，遵守平台条款。',
    },
    why: { eyebrow: '产品能力', h2: '为什么选择 VidSaveNow', items: [
      ['视频与 Shorts', '识别公开视频、Shorts、短链接及已结束直播的视频链接。'],
      ['原始可用画质', '选择源视频可用的 MP4 格式，包含画面和声音，不提升分辨率。'],
      ['小文件试用', '当前仅支持最大 4 MB 的文件；超出限制会显示提示。'],
      ['无需登录', '不索取账号或密码，使用公开可访问的视频链接。'],
    ] },
    howto: { eyebrow: '操作步骤', h2: '怎么下载 YouTube 视频', steps: [
      ['打开 YouTube', '在 YouTube App 或网页中打开想保存的公开视频或 Shorts。'],
      ['复制链接', '点击分享并复制视频链接，或复制浏览器地址栏中的视频地址。'],
      ['粘贴并解析', '将链接粘贴到上方输入框，点击「下载视频」获取可用格式。'],
      ['选择小文件', '选择包含声音的 MP4 保存到设备。当前试用最大 4 MB，较大的格式会被拒绝。'],
    ] },
    mobile: { eyebrow: '手机端', h2: '手机上怎么下载 YouTube 视频', points: [
      '用 Safari、Chrome 等手机浏览器打开本页，无需安装额外 App。',
      '从 YouTube App 复制视频或 Shorts 链接，回到本页粘贴并解析。',
      '选择可用的含声音 MP4，等待下载完成后查看浏览器下载记录。',
      '当前试用最大 4 MB；遇到文件过大或机器人验证提示时，下载无法继续。',
    ], noteTitle: '文件保存位置', notes: [['iPhone / iPad', '文件 App 的下载目录'], ['Android', '浏览器下载目录']] },
    pc: { eyebrow: '电脑端', h2: '电脑上怎么下载 YouTube 视频', points: [
      '可使用 Chrome、Edge、Safari 或 Firefox，无需安装软件。',
      '粘贴公开视频地址，获取可用的含声音 MP4 格式。',
      '支持的 Chrome 和 Edge 可选择保存位置；其他浏览器使用默认下载目录。',
      '所有浏览器均受当前试用最大 4 MB 的限制，更换浏览器不会提高限制。',
    ], noteTitle: '当前试用范围', notes: [['文件大小', '最大 4 MB'], ['视频格式', 'MP4，含画面和声音']] },
    faq: { eyebrow: '常见问题', h2: '常见问题解答', items: [
      ['如何下载 YouTube 视频？', '复制公开视频或 Shorts 链接，粘贴到本页并点击「下载视频」。解析后选择可用 MP4。当前试用仅支持最大 4 MB 的文件，YouTube 的访问限制可能导致失败。'],
      ['iPhone 上怎么下载 YouTube 视频？', '从 YouTube App 复制链接，在 Safari 或 Chrome 中打开本页并粘贴。下载成功的 MP4 可在文件 App 的下载目录中查看；当前最大 4 MB。'],
      ['安卓手机怎么下载 YouTube 视频？', '复制公开视频链接，粘贴到本页并选择 MP4。成功下载的小文件保存在浏览器下载目录，当前最大 4 MB。'],
      ['电脑上怎么下载 YouTube 视频？', '复制浏览器中的视频地址，粘贴到本页并选择可用 MP4。支持的 Chrome 和 Edge 可选择保存位置，其他浏览器使用默认目录；所有浏览器当前最大 4 MB。'],
      ['支持哪些 YouTube 链接？', '支持 HTTPS 的 youtube.com、www.youtube.com、m.youtube.com、music.youtube.com 视频链接，以及 youtu.be 短链接和 shorts、embed、live 视频路径。播放列表和频道链接不支持，仍在直播的视频也可能不可用。'],
      ['需要登录 YouTube 吗？', '本工具不索取账号或登录凭证。视频必须可以公开访问；私密、需要登录或需要机器人验证的内容可能无法解析。'],
      ['能下载什么清晰度？视频有声音吗？', '仅展示后端提供的原始可用 MP4，包含画面和声音。分辨率取决于源视频与当前环境，且文件必须符合最大 4 MB 的试用限制。合并分离的画面和音轨需要服务环境支持 FFmpeg。'],
      ['为什么提示文件过大或没有可下载的视频？', '当前试用文件最大 4 MB。含声音的 MP4 可能全部超过限制，或源视频没有当前服务支持的格式。可尝试更短的视频或更低的可用清晰度。'],
      ['为什么提示机器人验证、不可用或链接过期？', 'YouTube 可能阻止服务端访问，视频也可能私密或已删除。签名下载链接会过期，过期后请重新解析。机器人验证和访问限制可能持续存在，稍后重试也不保证成功。'],
    ] },
    footer: { disclaimer: '免责声明：仅保存你拥有版权或已获授权的内容，尊重创作者并遵守 YouTube 条款。VidSaveNow 与 YouTube 无关联。当前试用最大 4 MB，下载取决于视频及服务可用性。', tag: 'YouTube 视频在线下载工具', privacy: '隐私政策', terms: '服务条款', contact: '版权投诉' },
    errors: {
      INVALID_URL: '请输入有效的 HTTPS YouTube 视频链接。',
      TOO_LARGE: '文件超过当前试用的 4 MB 上限，请选择更低的可用清晰度或更短的视频。',
      YOUTUBE_BLOCKED: 'YouTube 要求机器人验证，当前服务无法获取视频。请稍后重试，访问限制可能仍然存在。',
      VIDEO_UNAVAILABLE: '视频不可用，可能已删除、设为私密、需要登录或受到地区限制。请确认原视频可以公开访问。',
      TOKEN_EXPIRED: '下载链接已过期，请重新解析视频后下载。',
      NO_VIDEO: '没有可下载的含声音 MP4。视频格式可能不受支持，或所有文件都超过当前 4 MB 上限。',
      PARSE_TIMEOUT: '解析超时，请稍后重试。', DOWNLOAD_TIMEOUT: '下载超时，请重新解析后重试。',
      YOUTUBE_NOT_CONFIGURED: 'YouTube 下载服务暂不可用，部署配置尚未就绪。请稍后再试。',
      RATE_LIMITED: '请求过于频繁，请稍后重试。',
      DOWNLOAD_FAILED: '下载失败，请重新解析后重试。当前仅支持最大 4 MB 的含声音 MP4。',
      INVALID_MEDIA: '下载服务未返回有效的含声音 MP4，请重新解析或选择其他可用格式。',
    },
  },
  en: {
    metaTitle: 'Free Online Video Downloader-youtube',
    metaDesc: 'Paste a public YouTube or Shorts link to choose an available original-quality MP4 with audio. The current trial supports small files up to 4 MB on mobile and desktop browsers.',
    keywords: ['VidSaveNow', 'YouTube video downloader', 'download YouTube videos online', 'YouTube Shorts downloader', 'YouTube MP4', 'how to download YouTube videos', 'YouTube downloader iPhone', 'YouTube downloader Android', 'YouTube downloader PC'],
    altLocale: { href: '/youtube', label: '中文' }, nav: { downloader: 'Downloader', howto: 'How to Download', faq: 'FAQ' },
    hero: {
      h1: 'YouTube Video Downloader', sub: 'Save available MP4 videos with audio from public YouTube videos and Shorts. Current trial: small files up to 4 MB.',
      placeholder: 'Paste YouTube video link', paste: 'Paste', download: 'Download', parsing: 'Parsing…',
      trust: 'Available original quality · MP4 with audio · Up to 4 MB', hint: 'Supports YouTube videos and Shorts; availability depends on YouTube access restrictions',
      stValid: '✓ YouTube video link recognized', stInvalid: 'Please enter a valid HTTPS YouTube video link',
      stLoading: 'Fetching video info…', stSuccess: 'Video parsed. Choose an available MP4 up to 4 MB.', stEmpty: 'Please paste a YouTube video link first',
      stPasteFail: 'Cannot read clipboard. Please paste into the field manually.', stCopyFail: 'Copy failed. Please select and copy manually.',
      stNetFail: 'Network error. Check your connection and retry.', stFail: 'Parsing failed. Check that the video is public and try again later.', stTimeout: 'Parsing timed out. Please try again later.',
    },
    loading: { title: 'Parsing video…', steps: ['Fetching video info', 'Finding MP4 with audio', 'Preparing download'] },
    result: {
      unknownAuthor: 'Unknown creator', copyInfo: 'Copy video info', copied: '✓ Copied', untitled: '(untitled)',
      infoAuthor: 'Creator: ', infoDuration: 'Duration: ', primaryCta: 'Download Available MP4', primarySub: 'Original quality · Up to 4 MB',
      secondaryCta: 'Download MP4', secondarySub: 'Alternative quality · Up to 4 MB', moreHead: 'More qualities',
      downloading: 'Downloading', saved: 'Video saved', cancel: 'Cancel download', progress: 'Download progress',
    },
    intro: { eyebrow: 'Online tool', h2: 'Download YouTube Videos and Shorts Online',
      p1: 'VidSaveNow parses public YouTube video and Shorts links in your browser, showing the cover, creator, title and available MP4 formats. Only original available formats with both video and audio are offered, without upscaling. The current trial supports files up to 4 MB.',
      p2: 'No software, browser extension or YouTube login credentials are required. Private, deleted, login-restricted or ongoing live videos may be unavailable. YouTube bot checks can also prevent parsing. Save content you own or are authorized to reuse and respect the platform terms.',
    },
    why: { eyebrow: 'Benefits', h2: 'Why VidSaveNow', items: [
      ['Videos and Shorts', 'Recognizes public videos, Shorts, short links and links to completed live videos.'],
      ['Available original quality', 'Choose source MP4 formats with video and audio, without increasing resolution.'],
      ['Small-file trial', 'Current downloads are limited to 4 MB. Larger files return a clear error.'],
      ['No login', 'We do not ask for your account or password. Use publicly accessible video links.'],
    ] },
    howto: { eyebrow: 'Step by step', h2: 'How to Download YouTube Videos', steps: [
      ['Open YouTube', 'Open the public video or Short in the YouTube app or website.'],
      ['Copy the link', 'Use Share to copy the video link, or copy the video URL from your browser.'],
      ['Paste and parse', 'Paste the link into the box above and press Download to fetch available formats.'],
      ['Choose a small file', 'Select an MP4 with audio to save to your device. The current trial is limited to 4 MB; larger formats are rejected.'],
    ] },
    mobile: { eyebrow: 'On your phone', h2: 'Download YouTube Videos on Mobile', points: [
      'Open this page in Safari, Chrome or another mobile browser without installing an extra app.',
      'Copy a video or Shorts link in the YouTube app, then paste it here to parse.',
      'Choose an available MP4 with audio, wait for completion and check your browser downloads.',
      'The current trial allows files up to 4 MB. File-size errors or bot checks prevent downloads from continuing.',
    ], noteTitle: 'Where files save', notes: [['iPhone / iPad', 'Downloads in the Files app'], ['Android', 'Browser downloads folder']] },
    pc: { eyebrow: 'On your computer', h2: 'Download YouTube Videos on PC', points: [
      'Use Chrome, Edge, Safari or Firefox without installing software.',
      'Paste a public video URL to get available MP4 formats with audio.',
      'Supported Chrome and Edge browsers let you choose a save location; other browsers use the default downloads folder.',
      'The current 4 MB trial limit applies to every browser. Changing browsers does not raise the limit.',
    ], noteTitle: 'Current trial', notes: [['File size', 'Up to 4 MB'], ['Format', 'MP4 with video and audio']] },
    faq: { eyebrow: 'FAQ', h2: 'Frequently Asked Questions', items: [
      ['How do I download a YouTube video?', 'Copy a public video or Shorts link, paste it here and press Download. Choose an available MP4. The current trial only supports files up to 4 MB, and YouTube access restrictions can cause failures.'],
      ['How do I download YouTube videos on iPhone?', 'Copy the link in the YouTube app, open this page in Safari or Chrome and paste it. Successfully downloaded MP4 files appear in Downloads in the Files app. The current limit is 4 MB.'],
      ['How do I download YouTube videos on Android?', 'Copy a public video link, paste it here and choose MP4. Successfully downloaded small files save to your browser downloads folder. The current limit is 4 MB.'],
      ['How do I download YouTube videos on PC or Mac?', 'Copy the video URL from your browser, paste it here and choose an available MP4. Supported Chrome and Edge browsers let you choose a location; others use the default folder. The current 4 MB limit applies to all browsers.'],
      ['Which YouTube links are supported?', 'HTTPS video links from youtube.com, www.youtube.com, m.youtube.com and music.youtube.com are supported, as are youtu.be short links and shorts, embed and live video paths. Playlist and channel links are not supported. Ongoing live videos may be unavailable.'],
      ['Do I need to log in to YouTube?', 'We do not ask for your account or login credentials. Videos must be publicly accessible. Private videos, videos requiring login and bot-check restrictions may prevent parsing.'],
      ['What quality is available, and does it include audio?', 'Only original available MP4 formats supplied by the backend with both video and audio are shown. Resolution depends on the source and service environment, and files must fit the current 4 MB trial limit. Merging separate video and audio tracks requires FFmpeg support in the service environment.'],
      ['Why is the file too large, or no video available?', 'The current trial supports files up to 4 MB. Every MP4 with audio may exceed this limit, or the source may lack a supported format. Try a shorter video or a lower available quality.'],
      ['Why do I see a bot check, unavailable video or expired link?', 'YouTube may block server access, or the video may be private or deleted. Signed download links expire; parse the video again to refresh them. Bot checks and access restrictions may persist, so retrying does not guarantee success.'],
    ] },
    footer: { disclaimer: 'Save only content you own or are authorized to reuse, respect creators and follow YouTube terms. VidSaveNow is not affiliated with YouTube. The current trial is limited to 4 MB; downloads depend on video and service availability.', tag: 'YouTube Video Downloader', privacy: 'Privacy', terms: 'Terms', contact: 'Contact' },
    errors: {
      INVALID_URL: 'Please enter a valid HTTPS YouTube video link.',
      TOO_LARGE: 'This file exceeds the current 4 MB trial limit. Choose a lower available quality or a shorter video.',
      YOUTUBE_BLOCKED: 'YouTube requires a bot check, so the service cannot retrieve this video. Try again later; access restrictions may persist.',
      VIDEO_UNAVAILABLE: 'This video may be deleted, private, require login or be region-restricted. Check that the original video is publicly accessible.',
      TOKEN_EXPIRED: 'This download link has expired. Parse the video again before downloading.',
      NO_VIDEO: 'No downloadable MP4 with audio is available. The format may be unsupported, or all files may exceed the current 4 MB limit.',
      PARSE_TIMEOUT: 'Parsing timed out. Please try again later.', DOWNLOAD_TIMEOUT: 'Download timed out. Parse the video again and retry.',
      YOUTUBE_NOT_CONFIGURED: 'YouTube downloads are temporarily unavailable because the service configuration is incomplete. Please try again later.',
      RATE_LIMITED: 'Too many requests. Please try again later.',
      DOWNLOAD_FAILED: 'Download failed. Parse the video again and retry. Only MP4 files with audio up to 4 MB are supported in this trial.',
      INVALID_MEDIA: 'The download service did not return a valid MP4 with audio. Parse again or choose another available format.',
    },
  },
  ja: {
    locale: 'ja',
    metaTitle: 'Free Online Video Downloader-youtube',
    metaDesc: 'VidSaveNow の YouTube 動画ダウンロードツール。公開動画や Shorts のリンクを貼り付け、利用できる元の画質の音声付き MP4 を保存できます。現在は最大 4 MB の小容量ファイル向け試用機能です。スマートフォンやパソコンのブラウザーで利用できます。',
    keywords: ['VidSaveNow', 'YouTube 動画ダウンロード', 'YouTube 動画オンライン保存', 'YouTube Shorts ダウンロード', 'YouTube MP4 ダウンロード', 'YouTube 動画の保存方法', 'スマートフォン YouTube 動画保存', 'パソコン YouTube 動画保存', 'YouTube 小容量動画ダウンロード'],
    altLocale: { href: '/youtube/en', label: 'English' },
    nav: { downloader: 'ダウンロード', howto: '保存方法', faq: 'よくある質問' },
    hero: {
      h1: 'YouTube 動画保存', sub: '公開動画や Shorts を音声付き MP4 で保存。現在の試用では最大 4 MB のファイルに対応しています。',
      placeholder: 'YouTube 動画のリンクを貼り付け', paste: '貼り付け', download: 'ダウンロード', parsing: '解析中…',
      trust: '元の画質 · 音声付き MP4 · 最大 4 MB', hint: 'YouTube 動画と Shorts のリンクに対応。利用できるかどうかは YouTube のアクセス制限によって異なります',
      stValid: '✓ YouTube 動画のリンクを確認しました', stInvalid: '有効な HTTPS の YouTube 動画リンクを入力してください',
      stLoading: '動画情報を取得しています…', stSuccess: '動画の解析が完了しました。最大 4 MB の利用できる MP4 を選んでください', stEmpty: 'まず YouTube 動画のリンクを貼り付けてください',
      stPasteFail: 'クリップボードを読み取れません。入力欄に手動で貼り付けてください', stCopyFail: 'コピーできませんでした。文字を選択して手動でコピーしてください',
      stNetFail: '通信エラーです。接続を確認して、もう一度お試しください', stFail: '解析できませんでした。動画が公開されていることを確認し、時間をおいてお試しください', stTimeout: '解析がタイムアウトしました。時間をおいてお試しください',
    },
    loading: { title: '動画を解析しています…', steps: ['動画情報を取得しています', '音声付き MP4 を探しています', 'ダウンロードを準備しています'] },
    result: {
      unknownAuthor: '投稿者が不明です', copyInfo: '動画情報をコピー', copied: '✓ コピーしました', untitled: '(タイトルなし)',
      infoAuthor: '投稿者の名前: ', infoDuration: '動画の長さ: ', primaryCta: '利用できる MP4 を保存', primarySub: '元の画質 · 最大 4 MB',
      secondaryCta: 'MP4 をダウンロード', secondarySub: 'その他の画質 · 最大 4 MB', moreHead: 'その他の画質を選ぶ',
      downloading: 'ダウンロード中', saved: '動画を保存しました', cancel: 'ダウンロードを中止', progress: 'ダウンロードの進行状況',
    },
    intro: {
      eyebrow: 'オンラインツール', h2: 'YouTube 動画と Shorts を保存',
      p1: 'VidSaveNow はブラウザーで公開 YouTube 動画や Shorts のリンクを解析し、カバー画像、投稿者、タイトル、保存できる MP4 形式を表示します。元の動画で利用できる、映像と音声を含む形式のみ提供し、解像度の拡大は行いません。現在は試用機能で、ファイルサイズの上限は 4 MB です。',
      p2: 'ソフトウェアやブラウザー拡張機能のインストールは不要で、YouTube のログイン情報も求めません。非公開、削除済み、ログインが必要な動画や配信中のライブ動画は保存できない場合があります。YouTube のボット確認によって解析が止まることもあります。ご自身が権利を持つ動画や利用許可を得た動画のみ保存し、プラットフォームの利用規約を守ってください。',
    },
    why: { eyebrow: '選ばれる理由', h2: 'VidSaveNow が選ばれる理由', items: [
      ['動画と Shorts に対応', '公開動画、Shorts、短縮リンク、終了したライブ配信の動画リンクを認識します。'],
      ['元の画質を選べる', '配信元が提供する、映像と音声を含む MP4 形式を選べます。解像度の拡大は行いません。'],
      ['小容量ファイルで試用', '現在の上限は 4 MB です。上限を超えるファイルにはエラーが表示されます。'],
      ['ログイン不要', 'アカウントやパスワードは求めません。公開されている動画のリンクをご利用ください。'],
    ] },
    howto: { eyebrow: '保存の手順', h2: 'YouTube 動画の保存方法', steps: [
      ['YouTube を開く', 'YouTube アプリまたはウェブサイトで、公開動画や Shorts を開きます。'],
      ['リンクをコピー', '共有メニューから動画のリンクをコピーします。ブラウザーでは動画の URL をコピーできます。'],
      ['貼り付けて解析', '上の入力欄にリンクを貼り付け、「ダウンロード」を押して利用できる形式を取得します。'],
      ['小容量のファイルを選ぶ', '音声付き MP4 を選んで端末に保存します。現在の試用では最大 4 MB に制限され、それより大きな形式は保存できません。'],
    ] },
    mobile: { eyebrow: 'スマートフォンで保存', h2: 'スマートフォンで YouTube 動画を保存', points: [
      'Safari や Chrome などのスマートフォンのブラウザーで本ページを開きます。追加のアプリは不要です。',
      'YouTube アプリで動画や Shorts のリンクをコピーし、本ページに貼り付けて解析します。',
      '利用できる音声付き MP4 を選び、完了を待ってブラウザーのダウンロード履歴を確認します。',
      '現在の試用の上限は 4 MB です。ファイルサイズのエラーやボット確認があると、ダウンロードを続けられません。',
    ], noteTitle: 'ファイルの保存先', notes: [['iPhone / iPad', 'ファイルアプリのダウンロードフォルダー'], ['Android', 'ブラウザーのダウンロードフォルダー']] },
    pc: { eyebrow: 'パソコンで保存', h2: 'パソコンで YouTube 動画を保存', points: [
      'Chrome、Edge、Safari、Firefox で使えます。ソフトウェアのインストールは不要です。',
      '公開動画の URL を貼り付けると、利用できる音声付き MP4 の形式が表示されます。',
      '対応する Chrome や Edge では保存先を選べます。その他のブラウザーでは標準のダウンロードフォルダーを使います。',
      '現在の試用の上限 4 MB は、すべてのブラウザーに適用されます。ブラウザーを変えても上限は増えません。',
    ], noteTitle: '現在の試用について', notes: [['ファイルサイズ', '最大 4 MB まで'], ['ファイル形式', '映像と音声を含む MP4']] },
    faq: { eyebrow: 'よくある質問', h2: 'よくある質問と回答', items: [
      ['YouTube 動画を保存するには？', '公開動画や Shorts のリンクをコピーし、本ページに貼り付けて「ダウンロード」を押します。利用できる MP4 を選んでください。現在の試用は最大 4 MB のファイルのみ対応しており、YouTube のアクセス制限によって失敗する場合があります。'],
      ['iPhone で YouTube 動画を保存するには？', 'YouTube アプリでリンクをコピーし、Safari または Chrome で本ページを開いて貼り付けます。保存が完了した MP4 はファイルアプリのダウンロードフォルダーにあります。現在の上限は 4 MB です。'],
      ['Android で YouTube 動画を保存するには？', '公開動画のリンクをコピーして本ページに貼り付け、MP4 を選びます。保存が完了した小容量ファイルはブラウザーのダウンロードフォルダーにあります。現在の上限は 4 MB です。'],
      ['パソコンや Mac で YouTube 動画を保存するには？', 'ブラウザーから動画の URL をコピーして本ページに貼り付け、利用できる MP4 を選びます。対応する Chrome や Edge では保存先を選べます。その他のブラウザーでは標準のフォルダーを使います。現在の上限 4 MB はすべてのブラウザーに適用されます。'],
      ['どの YouTube リンクに対応していますか？', 'youtube.com、www.youtube.com、m.youtube.com、music.youtube.com の HTTPS 動画リンク、youtu.be の短縮リンク、shorts・embed・live の動画パスに対応しています。再生リストやチャンネルのリンクには対応していません。配信中のライブ動画は利用できない場合があります。'],
      ['YouTube へのログインは必要ですか？', 'アカウントやログイン情報は求めません。動画が公開されている必要があります。非公開動画、ログインが必要な動画、ボット確認による制限がある動画は解析できない場合があります。'],
      ['どの画質を選べますか？音声も含まれますか？', 'バックエンドが提供する、元の動画で利用できる映像と音声を含む MP4 形式のみ表示されます。解像度は配信元とサービス環境によって異なり、ファイルは現在の試用上限の 4 MB 以内である必要があります。別々の映像と音声を結合するには、サービス環境で FFmpeg が利用できる必要があります。'],
      ['ファイルが大きすぎる、または動画が見つからないのはなぜですか？', '現在の試用は最大 4 MB のファイルのみ対応しています。すべての音声付き MP4 が上限を超えているか、対応する形式が配信元にない可能性があります。より短い動画や、利用できる低い画質をお試しください。'],
      ['ボット確認、動画の利用不可、リンクの期限切れが表示されるのはなぜですか？', 'YouTube がサーバーからのアクセスを拒否しているか、動画が非公開または削除済みの可能性があります。署名付きダウンロードリンクには期限があるため、再度解析して更新してください。ボット確認やアクセス制限が続く場合があり、再試行しても成功は保証されません。'],
    ] },
    footer: { disclaimer: 'ご自身が権利を持つコンテンツ、または利用許可を得たコンテンツのみ保存し、投稿者の権利と YouTube の利用規約を尊重してください。VidSaveNow は YouTube と提携していません。現在の試用の上限は 4 MB です。ダウンロードできるかどうかは動画とサービスの状況によって異なります。', tag: 'YouTube 動画ダウンロード', privacy: 'プライバシー', terms: '利用規約', contact: 'お問い合わせ' },
    errors: {
      INVALID_URL: '有効な HTTPS の YouTube 動画リンクを入力してください。',
      TOO_LARGE: 'このファイルは現在の試用上限の 4 MB を超えています。利用できる低い画質や、より短い動画を選んでください。',
      YOUTUBE_BLOCKED: 'YouTube のボット確認が必要なため、この動画を取得できません。時間をおいてお試しください。アクセス制限が続く場合があります。',
      VIDEO_UNAVAILABLE: '動画が削除済み、非公開、ログインが必要、または地域制限付きの可能性があります。元の動画が公開されていることを確認してください。',
      TOKEN_EXPIRED: 'ダウンロードリンクの有効期限が切れています。動画を再度解析してからダウンロードしてください。',
      NO_VIDEO: 'ダウンロードできる音声付き MP4 がありません。形式に対応していないか、すべてのファイルが現在の上限の 4 MB を超えている可能性があります。',
      PARSE_TIMEOUT: '解析がタイムアウトしました。時間をおいてお試しください。',
      DOWNLOAD_TIMEOUT: 'ダウンロードがタイムアウトしました。動画を再度解析してお試しください。',
      YOUTUBE_NOT_CONFIGURED: 'サービスの設定が完了していないため、YouTube のダウンロードは一時的に利用できません。時間をおいてお試しください。',
      RATE_LIMITED: 'リクエストが多すぎます。時間をおいてお試しください。',
      DOWNLOAD_FAILED: 'ダウンロードに失敗しました。動画を再度解析してお試しください。この試用では最大 4 MB の音声付き MP4 のみ対応しています。',
      INVALID_MEDIA: 'ダウンロードサービスから有効な音声付き MP4 を取得できませんでした。再度解析するか、別の利用できる形式を選んでください。',
    },
  },
};

export function youtubeErrorMessage(locale, code, status, fallback = 'PARSE_FAILED') {
  const t = YOUTUBE_DICT[locale] || YOUTUBE_DICT.zh;
  const aliases = { FILE_TOO_LARGE: 'TOO_LARGE', INVALID_TOKEN: 'TOKEN_EXPIRED', EXPIRED_TOKEN: 'TOKEN_EXPIRED',
    PRIVATE_VIDEO: 'VIDEO_UNAVAILABLE', BOT_CHECK: 'YOUTUBE_BLOCKED' };
  const key = status === 429 ? 'RATE_LIMITED' : aliases[code] || code;
  return t.errors[key] || (status === 413 ? t.errors.TOO_LARGE : status === 410 ? t.errors.TOKEN_EXPIRED : t.errors[fallback] || t.hero.stFail);
}

export function youtubeMetadata(locale) {
  const t = YOUTUBE_DICT[locale] || YOUTUBE_DICT.zh;
  const canonical = platformPath('youtube', YOUTUBE_DICT[locale] ? locale : 'zh');
  return {
    title: t.metaTitle, description: t.metaDesc, keywords: t.keywords,
    alternates: { canonical, languages: languageAlternates('youtube') },
    authors: [{ name: 'VidSaveNow', url: process.env.SITE_URL || 'https://www.vidsavenow.com' }],
    creator: 'VidSaveNow', publisher: 'VidSaveNow', category: 'technology',
    openGraph: { type: 'website', url: canonical, title: t.metaTitle, description: t.metaDesc, siteName: 'VidSaveNow',
      ...openGraphLocales(YOUTUBE_DICT[locale] ? locale : 'zh'),
      images: [{ url: '/youtube/social-image', width: 1200, height: 630, alt: 'VidSaveNow - YouTube Video Downloader' }] },
    twitter: { card: 'summary_large_image', title: t.metaTitle, description: t.metaDesc, images: ['/youtube/social-image'] },
  };
}

export function youtubeFaqJsonLd(locale) {
  const t = YOUTUBE_DICT[locale] || YOUTUBE_DICT.zh;
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.faq.items.map(([name, text]) => ({
    '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text },
  })) };
}
