/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export for dynamic e-commerce app
  // Static export doesn't work well with client components and dynamic routes
  // output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
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
