/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized for Vercel deployment
  trailingSlash: true,
  images: {
    domains: ['localhost', 'example.com', 'res.cloudinary.com', 'your-render-app.onrender.com'],
    // Enable image optimization for Vercel
    unoptimized: false,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  },
  // Enable experimental features for better performance
  experimental: {
    esmExternals: false,
  },
  // Enable static optimization where possible
  swcMinify: true,
}

module.exports = nextConfig
