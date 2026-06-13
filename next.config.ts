import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 清空配置以避免与 Turbopack 相关的兼容性问题 */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
