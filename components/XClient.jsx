'use client';

import { X_DICT, looksLikeX } from '@/lib/x-copy.mjs';
import VideoPlatformClient from './VideoPlatformClient';

export default function XClient({ locale = 'zh' }) {
  const t = X_DICT[locale] || X_DICT.zh;
  return <VideoPlatformClient locale={locale} platform="x" t={t}
    validateUrl={looksLikeX} endpoint="/api/xparse" />;
}
