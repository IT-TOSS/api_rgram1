// Environment configuration example
// Rename this file to config.ts and fill in your actual values
export const config = {
  // MongoDB connection
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database',
  
  // JWT authentication
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  
  // Email configuration
  email: {
    user: process.env.EMAIL_USER || 'your_email@example.com',
    pass: process.env.EMAIL_PASS || 'your_email_password',
    from: process.env.EMAIL_FROM || 'your_email@example.com'
  },
  
  // Server configuration
  port: process.env.PORT || 5001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // API keys (if needed)
  googleOAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret'
  },
  
  // Cloudinary configuration (if used)
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
    apiKey: process.env.CLOUDINARY_API_KEY || 'your_api_key',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
  }
};