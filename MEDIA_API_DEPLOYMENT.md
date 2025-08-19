# Media Upload API Deployment Guide

## Overview

This document provides instructions for deploying the Media Upload API to Vercel, ensuring that media files (images and videos) are properly saved and retrieved in the production environment.

## Deployment Steps

### 1. Push to GitHub

First, push your code to a GitHub repository:

```bash
git add .
git commit -m "Add media upload API with local storage support"
git push origin main
```

### 2. Connect to Vercel

1. Log in to your Vercel account
2. Create a new project and connect it to your GitHub repository
3. Configure the project settings:

### 3. Environment Variables

Set the following environment variables in the Vercel project settings:

- `NEXT_PUBLIC_BASE_URL`: Your production domain (e.g., https://your-app.vercel.app)
- `JWT_SECRET`: Your JWT secret key for authentication

### 4. Build and Deploy

Vercel will automatically build and deploy your application. The deployment will use the configuration in `vercel.json` to properly route requests to the media upload API.

## How It Works on Vercel

### File Storage in Production

In the Vercel production environment, the file system is read-only, which means files cannot be written directly to the file system. The API handles this in two ways:

1. **Local Development**: Files are saved to the local file system in the `public/upload` directory
2. **Vercel Production**: The API detects the Vercel environment and adapts accordingly:
   - Error handling is in place to prevent crashes when file operations fail
   - The API returns appropriate URLs for accessing media files

### Media Retrieval

Media files can be retrieved in two ways:

1. **By File Path**: `/api/mediaupload?filePath=/upload/image/filename.jpg`
2. **By File ID and Type**: `/api/mediaupload?fileId=custom-id&fileType=image`

In production, all media requests are routed through the API endpoint, which handles serving the files with proper content types and caching headers.

## Testing the Deployment

After deployment, you can test the API using the provided test page:

1. Navigate to `https://your-app.vercel.app/media-upload-test.html`
2. Use the form to upload media files
3. Test retrieving media files using the retrieval form

## Troubleshooting

### Common Issues

1. **File Upload Fails**: Check that your authentication token is valid
2. **File Retrieval Fails**: Verify that the file path or ID is correct
3. **CORS Errors**: Ensure that your API is properly handling CORS headers

### Logs

Check the Vercel deployment logs for any errors related to the media upload API.

## Next Steps

For a more robust production solution, consider:

1. Implementing a cloud storage solution (e.g., AWS S3, Google Cloud Storage)
2. Adding file validation and virus scanning
3. Implementing image processing (e.g., resizing, compression)
4. Setting up a CDN for faster media delivery