'use client';

import { YOUTUBE_DICT, youtubeErrorMessage } from '@/lib/youtube-copy.mjs';
import { looksLikeYoutube } from '@/lib/youtube-url.mjs';
import VideoPlatformClient from './VideoPlatformClient';

export default function YoutubeClient({ locale = 'zh' }) {
  return <VideoPlatformClient locale={locale} platform="youtube" t={YOUTUBE_DICT[locale] || YOUTUBE_DICT.zh}
    validateUrl={looksLikeYoutube} endpoint="/api/youtube" timeoutMs={60_000}
    errorMessage={(code, status) => youtubeErrorMessage(locale, code, status)} />;
}
