import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  ...(isProd && { output: 'export' }),
  basePath: isProd ? '/crm-project' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
