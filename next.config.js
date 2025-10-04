/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to enable API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Only use basePath for static export if needed
  // basePath: process.env.NODE_ENV === 'production' ? '/pijar-pro-pantau' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/pijar-pro-pantau/' : '',
}

module.exports = nextConfig