import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Point Turbopack explicitly to your frontend directory root to fix the multi-lockfile warning
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
