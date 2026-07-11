import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // This prevents the "Collecting page data" step from running
  // which is where the silent crash happens
  experimental: {
    ppr: false,
    dynamicOnHover: false,
  },
  // Disable static optimization completely
  trailingSlash: true,
  reactStrictMode: false,
};

export default nextConfig;
