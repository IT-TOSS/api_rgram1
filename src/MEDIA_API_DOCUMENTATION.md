# Media API Documentation

## Overview

The Media API provides endpoints for uploading, managing, and retrieving media files. It uses Cloudinary for storage and MongoDB for metadata management.

## Authentication

All endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### Upload Media

**Endpoint:** `POST /api/media/upload`

**Description:** Upload a new media file to Cloudinary and store its metadata in MongoDB.

**Request:**
- Content-Type: multipart/form-data
- Body:
  - `file`: The file to upload (required)
  - `customId`: Custom ID for the file (optional)

**Response:**
```json
{
  "success": true,
  "media": {
    "_id": "media_id",
    "userId": "user_id",
    "originalName": "original_filename.jpg",
    "fileName": "stored_filename.jpg",
    "publicId": "cloudinary_public_id",
    "url": "https://cloudinary.com/path/to/file.jpg",
    "fileType": "image/jpeg",
    "fileSize": 12345,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Delete Media

**Endpoint:** `DELETE /api/media/delete`

**Description:** Delete a media file from Cloudinary and remove its metadata from MongoDB.

**Request:**
- Content-Type: application/json
- Body:
  ```json
  {
    "mediaId": "media_id"
  }
  ```

**Response:**
```json
{
  "success": true,
  "message": "Media deleted successfully"
}
```

### Rename Media

**Endpoint:** `PUT /api/media/rename`

**Description:** Rename a media file in Cloudinary and update its metadata in MongoDB.

**Request:**
- Content-Type: application/json
- Body:
  ```json
  {
    "mediaId": "media_id",
    "newName": "new_filename"
  }
  ```

**Response:**
```json
{
  "success": true,
  "media": {
    "_id": "media_id",
    "userId": "user_id",
    "originalName": "new_filename.jpg",
    "fileName": "new_filename.jpg",
    "publicId": "cloudinary_public_id",
    "url": "https://cloudinary.com/path/to/file.jpg",
    "fileType": "image/jpeg",
    "fileSize": 12345,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Replace Media

**Endpoint:** `PUT /api/media/replace`

**Description:** Replace an existing media file with a new one in Cloudinary and update its metadata in MongoDB.

**Request:**
- Content-Type: multipart/form-data
- Body:
  - `file`: The new file to upload (required)
  - `mediaId`: ID of the media to replace (required)

**Response:**
```json
{
  "success": true,
  "media": {
    "_id": "media_id",
    "userId": "user_id",
    "originalName": "new_filename.jpg",
    "fileName": "stored_filename.jpg",
    "publicId": "cloudinary_public_id",
    "url": "https://cloudinary.com/path/to/file.jpg",
    "fileType": "image/jpeg",
    "fileSize": 12345,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages in case of failure:

```json
{
  "error": "Error message"
}
```

Common status codes:
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource not found)
- 500: Internal Server Error