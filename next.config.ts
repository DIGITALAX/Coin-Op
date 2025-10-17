import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thedial.infura-ipfs.io",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/lens/**",
      },
      {
        protocol: "https",
        hostname: "themanufactory.xyz",
        pathname: "/api/infura/**",
      },
    ],
    unoptimized: true,
  },
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Headers",
            value: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          },
          {
            key: "Access-Control-Allow-Methods", 
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
