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
  experimental: {
    turbopack: false,
  },
  webpack: (config, { isServer }) => {
    return config;
  },
  // Increase body size limit for file uploads (default is 1MB, we need 50MB for photos)
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

// Set thread pool size at config load time
if (typeof process !== 'undefined' && !process.env.UV_THREADPOOL_SIZE) {
  process.env.UV_THREADPOOL_SIZE = '4';
}

export default nextConfig;
