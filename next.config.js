/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable API routes for production
  trailingSlash: false,
  images: {
    unoptimized: true,
    domains: ['localhost']
  },
  // Optimize for Vercel deployment
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless']
  },
  // Environment variables validation
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000'
  }
}

module.exports = nextConfig