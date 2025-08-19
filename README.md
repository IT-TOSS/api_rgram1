# API RGram Media Upload API

This repository contains the Media Upload API for the API RGram application. It provides endpoints for uploading, listing, retrieving, updating, and deleting media files.

## Features

- Upload media files (images and videos)
- List all media files with pagination and filtering
- Get a single media file by ID
- Rename media files
- Replace media files
- Delete media files
- JWT authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/IT-TOSS/api_rgram1.git
   cd api_rgram1
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

## API Documentation

See [MEDIA_API_DOCUMENTATION.md](./MEDIA_API_DOCUMENTATION.md) for detailed API documentation.

## Authentication

All API endpoints require authentication using JWT tokens. Include the token in the Authorization header as follows:

```
Authorization: Bearer your_jwt_token
```

## Directory Structure

```
├── lib
│   ├── database.ts            # MongoDB connection
│   ├── middleware
│   │   └── auth.ts            # Authentication middleware
│   └── models
│       ├── BlacklistedToken.ts # Token blacklist model
│       ├── Media.ts           # Media model
│       └── User.ts            # User model
├── pages
│   └── api
│       └── media
│           └── manage.ts      # Media API endpoint
├── public
│   └── uploads               # Local storage for uploaded files
├── .env.local                # Environment variables (create this file)
├── .gitignore                # Git ignore file
├── package.json              # Project dependencies
└── README.md                # Project documentation
```

## License

MIT