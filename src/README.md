# Media Upload API

This repository contains the Media Upload API for handling file uploads, storage, and management using Next.js API routes and Cloudinary.

## Features

- File upload to Cloudinary
- File deletion
- File renaming
- File replacement
- JWT authentication
- MongoDB integration

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/IT-TOSS/api_rgram1.git
   cd api_rgram1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create configuration file:
   - Copy `src/lib/config.example.ts` to `src/lib/config.ts`
   - Update the configuration with your MongoDB URI, JWT secret, and Cloudinary credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Upload File
- **POST** `/api/media/upload`
- Requires authentication (Bearer token)
- Form data with 'file' field

### Delete File
- **DELETE** `/api/media/delete`
- Requires authentication (Bearer token)
- JSON body with 'mediaId' field

### Rename File
- **PUT** `/api/media/rename`
- Requires authentication (Bearer token)
- JSON body with 'mediaId' and 'newName' fields

### Replace File
- **PUT** `/api/media/replace`
- Requires authentication (Bearer token)
- Form data with 'file' and 'mediaId' fields

## Authentication

All API endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```