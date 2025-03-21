import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/@:username',
        destination: '/users/:username',
      },
    ];
  },
};

export default nextConfig;
