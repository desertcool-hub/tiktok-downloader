'use client';

import { X_DICT, looksLikeX } from '@/lib/x-copy.mjs';
import VideoPlatformClient from './VideoPlatformClient';

export default function XClient({ locale = 'zh' }) {
  const t = X_DICT[locale] || X_DICT.zh;
  return <VideoPlatformClient locale={locale} platform="x" t={t}
    validateUrl={looksLikeX} endpoint="/api/xparse"
    errorMessage={locale === 'ja' ? (code, status) => status === 429 ? 'リクエストが多すぎます。しばらくしてから再度お試しください。'
      : code === 'NO_VIDEO' ? '保存できる MP4 動画がありません。画像のみの投稿やライブ配信には対応していません。' : t.hero.stFail : undefined} />;
}
