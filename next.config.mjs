/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Use pages directory
  useFileSystemPublicRoutes: true,

  // Configure image optimization
  images: {
    domains: ['res.cloudinary.com', 'storage.googleapis.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Disable static optimization for API routes
  output: 'standalone',

  // Configure webpack for optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        stream: false,
        crypto: false,
        os: false,
        path: false,
      };
    }
    return config;
  },

  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mjs'],

  // Ensure API routes work properly
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/api/videos/fetch-religious-reels',
        destination: '/api/videos/religious-reels',
      },
    ];
  },

  // Configure headers for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS,PATCH' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ]
      }
    ]
  }
};

export default nextConfig;
