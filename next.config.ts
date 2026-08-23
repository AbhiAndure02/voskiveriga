import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // You can add more hostnames here later if needed
    ],
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
