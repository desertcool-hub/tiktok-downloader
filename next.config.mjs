/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 下载接口流式转发可能耗时较长，放宽 API 路由超时
  experimental: {
    proxyTimeout: 120_000,
  },
};

export default nextConfig;
