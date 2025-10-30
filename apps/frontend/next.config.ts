import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   /* config options here */
   devIndicators: false,
   transpilePackages: ['@encontra-pet/utils'],
};

export default nextConfig;
