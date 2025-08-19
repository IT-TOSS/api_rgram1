/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure image domains if needed
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'api-rgram1.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**vercel.app',
      },
    ],
  },
  // Configure experimental features
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Output standalone build for better compatibility with Vercel
  output: 'standalone',
  // Ensure API routes are properly handled
  async rewrites() {
    return [
      {
        source: '/upload/:path*',
        destination: '/api/mediaupload?filePath=/upload/:path*',
      },
    ];
  },
};

module.exports = nextConfig;