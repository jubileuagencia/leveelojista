import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.panda.video",
      },
      {
        protocol: "https",
        hostname: "player-vz-*.tv.pandavideo.com.br",
      },
    ],
  },
};

export default nextConfig;
