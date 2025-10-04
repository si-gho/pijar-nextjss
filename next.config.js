/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  serverExternalPackages: ['@neondatabase/serverless'],
  // Disable chunk optimization in development to prevent loading errors
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.optimization.splitChunks = false
    }
    
    // Handle SES (Secure EcmaScript) warnings in production
    if (!dev && isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  // Additional configuration to reduce SES warnings
  env: {
    SUPPRESS_SES_WARNINGS: 'true'
  }
}

module.exports = nextConfig