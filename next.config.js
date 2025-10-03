/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/pijar-pro-pantau' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/pijar-pro-pantau/' : '',
}

module.exports = nextConfig