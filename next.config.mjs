/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const port = process.env.YOUTUBE_DEV_PORT;
    if (process.env.NODE_ENV !== 'development' || !/^\d{4,5}$/.test(port || '') || Number(port) > 65535) return [];
    return [{ source: '/api/youtube', destination: `http://127.0.0.1:${port}/api/youtube` }];
  },
  // 下载接口流式转发可能耗时较长，放宽 API 路由超时
  experimental: {
    proxyTimeout: process.env.NODE_ENV === 'development' && process.env.YOUTUBE_DEV_PORT ? 240_000 : 120_000,
  },
};

export default nextConfig;
