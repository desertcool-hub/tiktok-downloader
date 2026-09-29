/**
 * 极简内存限流（单实例部署够用；多实例部署请换 Redis）
 */

import { pickClientIp } from './request-ip.mjs';

const buckets = new Map();

/** 滑动窗口限流：windowMs 内最多 limit 次 */
export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  let arr = (buckets.get(key) || []).filter((t) => now - t < windowMs);

  if (arr.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - arr[0])) / 1000);
    buckets.set(key, arr);
    return { ok: false, retryAfter };
  }

  arr.push(now);
  buckets.set(key, arr);

  // 防止 Map 无限增长
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return { ok: true };
}

/** 取客户端 IP（Vercel/Nginx 都会带 x-forwarded-for） */
export function clientIp(req) {
  return pickClientIp(req.headers);
}
