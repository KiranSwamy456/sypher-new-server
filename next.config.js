/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' to enable API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Add this if you're using app router
  experimental: {
    serverComponentsExternalPackages: ['mysql2']
  }
}

module.exports = nextConfig
