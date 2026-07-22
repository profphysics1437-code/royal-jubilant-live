import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  // Disable Turbopack — use webpack instead.
  // Turbopack crashes on shared hosting (Hostinger) due to thread pool limits.
  // Webpack is single-threaded for the most part and runs reliably on shared hosting.
  // Also sets UV_THREADPOOL_SIZE=4 to limit libuv threads (prevents "Resource
  // temporarily unavailable" panics from rayon-core during build).
  experimental: {
    turbopack: false,
  },
  // Force webpack for build
  webpack: (config, { isServer }) => {
    return config;
  },
};

// Set thread pool size at config load time
if (typeof process !== 'undefined' && !process.env.UV_THREADPOOL_SIZE) {
  process.env.UV_THREADPOOL_SIZE = '4';
}

export default nextConfig;
