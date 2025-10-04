/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  serverExternalPackages: ['@neondatabase/serverless'],
  // Disable chunk optimization in development to prevent loading errors
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization.splitChunks = false
    }
    return config
  }
}

module.exports = nextConfig