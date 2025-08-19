// Environment configuration
export const config = {
  // MongoDB connection
  mongodbUri: process.env.MONGODB_URI,

  // JWT authentication
  jwtSecret: process.env.JWT_SECRET,

  // Email configuration
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM
  },

  // Server configuration
  port: process.env.PORT,
  corsOrigin: process.env.CORS_ORIGIN,

  // API keys
  youtubeApiKey: process.env.YOUTUBE_API_KEY,

  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    mockAuth: process.env.MOCK_GOOGLE_AUTH === 'true'
  },

  // Environment
  nodeEnv: process.env.NODE_ENV,
  nextAuthUrl: process.env.NEXTAUTH_URL,

  // Cloudinary configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }
}