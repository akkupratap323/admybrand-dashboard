/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance and security optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Disable features that might cause issues
  generateEtags: false,
  poweredByHeader: false,
  
  // Optimize build output
  swcMinify: true,
  
  // Remove problematic experimental features
  // experimental: {
  //   optimizeCss: true,
  //   gzipSize: true,
  // },

  // Ensure proper routing for SPA behavior
  async redirects() {
    return []
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig