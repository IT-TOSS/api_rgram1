/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure image domains if needed
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  // Configure experimental features
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Output standalone build for better compatibility with Vercel
  output: 'standalone',
};

module.exports = nextConfig;