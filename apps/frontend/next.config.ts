import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   devIndicators: false,
   reactStrictMode: false,
   transpilePackages: ['@encontra-pet/utils'],
   images: {
      remotePatterns: [
         {
            protocol: 'http',
            hostname: 'localhost',
            port: '3001',
            pathname: '/**',
         },
      ],
   },
};

export default nextConfig;
