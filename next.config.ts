import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce memory usage during compilation by tree-shaking heavy packages
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@botpress/webchat",
      "react-admin",
      "ra-data-simple-rest",
    ],
  },
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Content-Range",
            value: "bytes : 0-9/*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

