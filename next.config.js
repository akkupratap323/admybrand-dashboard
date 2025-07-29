/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is stable in Next.js 14 - no need for experimental flag
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
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable static exports if needed
  // output: 'export',
  // trailingSlash: true,
}

module.exports = nextConfig