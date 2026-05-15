import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'e-vexii.com' },
    ],
  },
};

export default nextConfig;
