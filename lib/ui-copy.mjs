import { UI_TRANSLATIONS } from './translations/index.mjs';

const BASE_UI = {
  en: { platformsLabel: 'Download platforms', videoLabel: 'Video', rateLimited: 'Too many requests. Please try again later.',
    noVideo: 'This post has no downloadable MP4 video. Live streams and image-only posts are not supported.',
    downloadFailed: 'Download failed. Try parsing the link again, or use desktop Chrome / Edge for files larger than 256 MB.' },
  zh: { platformsLabel: '下载平台', videoLabel: '视频', rateLimited: '请求过于频繁，请稍后重试。',
    noVideo: '此帖子没有可下载的 MP4 视频，不支持直播或纯图片帖子。', downloadFailed: '下载失败，请重新解析链接。超过 256 MB 的文件请使用电脑 Chrome 或 Edge。' },
  ja: { platformsLabel: 'ダウンロード対象', videoLabel: '動画', rateLimited: 'リクエストが多すぎます。しばらくしてから再度お試しください。',
    noVideo: '保存できる MP4 動画がありません。画像のみの投稿やライブ配信には対応していません。',
    downloadFailed: 'ダウンロードに失敗しました。リンクを再解析してください。256 MB を超える動画にはパソコンの Chrome または Edge をお使いください。' },
};

export function uiCopy(locale) { return UI_TRANSLATIONS[locale] || BASE_UI[locale] || BASE_UI.en; }

export function parseErrorMessage(locale, code, status, fallback, invalid, serverMessage) {
  const ui = uiCopy(locale);
  if (status === 429) return ui.rateLimited;
  if (status === 400) return invalid || fallback;
  if (code === 'NO_VIDEO') return ui.noVideo;
  return locale === 'zh' && serverMessage ? serverMessage : fallback;
}
