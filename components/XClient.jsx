'use client';

import { X_DICT, looksLikeX } from '@/lib/x-copy.mjs';
import VideoPlatformClient from './VideoPlatformClient';

export default function XClient({ locale = 'zh' }) {
  return <VideoPlatformClient locale={locale} platform="x" t={X_DICT[locale] || X_DICT.zh}
    validateUrl={looksLikeX} endpoint="/api/xparse" />;
}
