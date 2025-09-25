/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    domains: ['localhost', 'example.com', 'res.cloudinary.com'],
    // For static export, we need to use unoptimized images
    unoptimized: process.env.NODE_ENV === 'production',
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
