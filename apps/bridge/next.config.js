/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  optimizeFonts: false,
  experimental: {
    optimizeCss: true,
  },

  async redirects() {
    return [
      {
        source: "/blog",
        destination:
          "https://mirror.xyz/0xfb18aAc9D6ABbDD00fd59dD15d03a49428A3fe22",
        permanent: true,
      },
      {
        source: "/docs",
        destination: "https://docs.superbridge.app",
        permanent: true,
      },
      {
        source: "/register",
        destination: "https://r9vkbxvmyui.typeform.com/to/kvTnybhJ",
        permanent: true,
      },
      ...[
        "arbitrum-one",
        "arbitrum-nova",
        "kroma",
        "rollux",
        "orb3-mainnet",
        "parallel",
      ].map((link) => ({
        source: "/" + link,
        destination: "https://app.rollbridge.app/" + link,
        permanent: true,
        has: [
          { type: "host", value: "superbridge.app" },
          { type: "host", value: "app.superbridge.app" },
        ],
      })),
    ];
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer(config);
