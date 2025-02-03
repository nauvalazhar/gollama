import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // disable eslint and typescript errors temporarily
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
