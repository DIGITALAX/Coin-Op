/** @type {import('next').NextConfig} */

const allowedOrigins = [
  "https://api-mumbai.lens.dev",
  "https://api.lens.dev",
  "https://chromadin.infura-ipfs.io",
  "https://tenor.googleapis.com",
  "https://api.studio.thegraph.com",
  "https://api.thegraph.com",
  "https://youtube.com",
  "https://vimeo.com",
  `https://${process.env.NEXT_PUBLIC_ALGOLIA_ID}-dsn.algolia.net`,
];

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chromadin.infura-ipfs.io",
        pathname: "/ipfs/**",
      },
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins.join(","),
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Origin, X-Requested-With, Content-Type, Accept, Authorization",
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

module.exports = nextConfig;
