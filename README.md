# Swayam Media API

A Next.js API for media management with authentication. This API allows users to upload, delete, rename, and replace media files with user-specific identification, using MongoDB for data storage and Cloudinary for media storage.

## Features

- User authentication (signup and login)
- Media file management:
  - Upload media files with custom IDs
  - Delete media files
  - Rename media files
  - Replace media files
- All media operations are authenticated and tied to specific users
- MongoDB for data storage
- Cloudinary for media storage
- JWT-based authentication

## API Endpoints

### Authentication

#### Signup

```
POST /api/auth/signup
```

Request body:
```json
{
  "username": "example_user",
  "email": "user@example.com",
  "password": "secure_password"
}
```

Response:
```json
{
  "user": {
    "id": "1234567890",
    "username": "example_user",
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

#### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

Response:
```json
{
  "user": {
    "id": "1234567890",
    "username": "example_user",
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

### Media Management

#### Upload Media

```
POST /api/media/upload
```

Request headers:
```
Authorization: Bearer jwt_token_here
```

Request body (multipart/form-data):
- `file`: The media file to upload
- `customId` (optional): A custom ID for the file

Response:
```json
{
  "success": true,
  "media": {
    "id": "1234567890",
    "userId": "user_id_here",
    "originalName": "example.jpg",
    "fileName": "1234567890.jpg",
    "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/media/user_id/1234567890.jpg",
    "fileType": "image/jpeg",
    "fileSize": 12345,
    "customId": "custom_id_or_media_id"
  }
}
```

#### Delete Media

```
DELETE /api/media/delete?id=media_id_here
```

Request headers:
```
Authorization: Bearer jwt_token_here
```

Response:
```json
{
  "success": true,
  "message": "Media deleted successfully"
}
```

#### Rename Media

```
PATCH /api/media/rename
```

Request headers:
```
Authorization: Bearer jwt_token_here
```

Request body:
```json
{
  "id": "media_id_here",
  "newName": "new_file_name"
}
```

Response:
```json
{
  "success": true,
  "media": {
    "id": "1234567890",
    "userId": "user_id_here",
    "originalName": "new_file_name.jpg",
    "fileName": "new_file_name.jpg",
    "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/media/user_id/new_file_name.jpg",
    "fileType": "image/jpeg",
    "fileSize": 12345
  }
}
```

#### Replace Media

```
PUT /api/media/replace
```

Request headers:
```
Authorization: Bearer jwt_token_here
```

Request body (multipart/form-data):
- `file`: The new media file
- `id`: The ID of the media to replace

Response:
```json
{
  "success": true,
  "media": {
    "id": "1234567890",
    "userId": "user_id_here",
    "originalName": "replacement.jpg",
    "fileName": "replacement.jpg",
    "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/media/user_id/replacement.jpg",
    "fileType": "image/jpeg",
    "fileSize": 12345
  }
}
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- MongoDB Atlas account
- Cloudinary account

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file in the root directory with the following variables (see `.env.example`)
4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=your_email@example.com
PORT=5001
CORS_ORIGIN=http://localhost:3000
YOUTUBE_API_KEY=your_youtube_api_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
MOCK_GOOGLE_AUTH=true
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3001
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Security Considerations

- All API endpoints that handle media operations require authentication
- Users can only access, modify, or delete their own media files
- Passwords are hashed before storage
- JWT tokens are used for authentication
- Environment variables are used for sensitive information