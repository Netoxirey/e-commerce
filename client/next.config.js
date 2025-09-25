/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  trailingSlash: true,
  images: {
    domains: ['localhost', 'example.com', 'res.cloudinary.com'],
    // Optimize images for better performance
    unoptimized: false,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  },
  // Disable server-side features for static export
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig
