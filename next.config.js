/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    serverExternalPackages: ['encoding'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    removeConsole: false,
  },
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
}

module.exports = nextConfig