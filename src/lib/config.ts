// Environment configuration
export const config = {
  // MongoDB connection
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/api_rgram',
  
  // JWT authentication
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  
  // Email configuration
  email: {
    user: process.env.EMAIL_USER || 'your_email@example.com',
    pass: process.env.EMAIL_PASS || 'your_email_password',
    from: process.env.EMAIL_FROM || 'your_email@example.com'
  },
  
  // Server configuration
  port: process.env.PORT || 5001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // API keys
  youtubeApiKey: process.env.YOUTUBE_API_KEY || 'your_youtube_api_key',
  
  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
    mockAuth: process.env.MOCK_GOOGLE_AUTH === 'true'
  },
  
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3001',
  
  // Cloudinary configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
    apiKey: process.env.CLOUDINARY_API_KEY || 'your_api_key',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
  }
};