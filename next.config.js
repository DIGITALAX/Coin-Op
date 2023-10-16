/** @type {import('next').NextConfig} */
import withPolyfills from "next-polyfill-npm";

const allowedOrigins = [
  "https://api.lens.dev",
  "https://chromadin.infura-ipfs.io",
  "https://tenor.googleapis.com",
  "https://api.studio.thegraph.com",
  "https://api.thegraph.com",
  "https://youtube.com",
  "https://vimeo.com",
  `https://${process.env.NEXT_PUBLIC_ALGOLIA_ID}-dsn.algolia.net`,
];

const nextConfig = withPolyfills({
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false,  buffer: require.resolve('buffer/') };
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
  fallback
});

module.exports = nextConfig;
