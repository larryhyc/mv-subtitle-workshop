import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 设置为 true，表示允许在项目中存在 ESLint 错误的情况下，生产构建也能成功。
    // 这将禁用 Vercel/Next.js 在构建阶段的 ESLint 检查。
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
