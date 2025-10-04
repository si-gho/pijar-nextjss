/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic Next.js configuration
  reactStrictMode: true,
  
  // Image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // External packages for serverless (Next.js 15+ syntax)
  serverExternalPackages: ['@neondatabase/serverless'],
}

module.exports = nextConfig