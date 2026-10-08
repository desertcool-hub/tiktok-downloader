export const YOUTUBE_DICT = {
  zh: {
    metaTitle: 'VidSaveNow - YouTube 视频在线下载工具（MP4）',
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
    metaTitle: 'VidSaveNow - YouTube Video Downloader (MP4)',
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
  const canonical = locale === 'en' ? '/youtube/en' : '/youtube';
  return {
    title: t.metaTitle, description: t.metaDesc, keywords: t.keywords,
    alternates: { canonical, languages: { en: '/youtube/en', 'zh-CN': '/youtube' } },
    authors: [{ name: 'VidSaveNow', url: process.env.SITE_URL || 'https://www.vidsavenow.com' }],
    creator: 'VidSaveNow', publisher: 'VidSaveNow', category: 'technology',
    openGraph: { type: 'website', url: canonical, title: t.metaTitle, description: t.metaDesc, siteName: 'VidSaveNow',
      locale: locale === 'en' ? 'en_US' : 'zh_CN', alternateLocale: [locale === 'en' ? 'zh_CN' : 'en_US'],
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
