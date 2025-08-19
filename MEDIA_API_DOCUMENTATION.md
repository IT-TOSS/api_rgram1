# Media Management API Documentation

This API allows users to upload, delete, rename, and replace media files (images and videos) with local storage and unique IDs for easy identification.

## API Endpoints

### Base URL

```
/api/media/manage
```

## Authentication

All endpoints require authentication using a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

> **CRITICAL**: You MUST include the `Bearer ` prefix before your token. Sending just the token without the `Bearer ` prefix will result in a 401 Unauthorized response with the message "Authorization header missing or invalid format".
>
> Example of correct header:
> ```
> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
> ```
>
> Example of incorrect header:
> ```
> Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
> ```
>
> The token must be a valid JWT token issued by the authentication system. If the token is missing, invalid, or expired, the API will return a 401 Unauthorized response.

## Endpoints

### Upload Media

**Request:**

```
POST /api/media/manage
```

Use form-data with a file field containing the image or video file.

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "filename": "123e4567-e89b-12d3-a456-426614174000.jpg",
    "originalFilename": "my-image.jpg",
    "path": "/uploads/60d21b4667d0d8992e610c85/123e4567-e89b-12d3-a456-426614174000.jpg",
    "type": "image",
    "size": 1024000,
    "url": "http://localhost:3000/uploads/60d21b4667d0d8992e610c85/123e4567-e89b-12d3-a456-426614174000.jpg",
    "createdAt": "2023-06-22T10:00:00.000Z"
  }
}
```

### Get Media List

**Request:**

```
GET /api/media/manage
```

Optional query parameters:
- `type`: Filter by media type (`image` or `video`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "filename": "123e4567-e89b-12d3-a456-426614174000.jpg",
      "originalFilename": "my-image.jpg",
      "path": "/uploads/60d21b4667d0d8992e610c85/123e4567-e89b-12d3-a456-426614174000.jpg",
      "type": "image",
      "size": 1024000,
      "mimeType": "image/jpeg",
      "url": "http://localhost:3000/uploads/60d21b4667d0d8992e610c85/123e4567-e89b-12d3-a456-426614174000.jpg",
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### Get Single Media

**Request:**

```
GET /api/media/manage?id=60d21b4667d0d8992e610c85
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "filename": "123e4567-e89b-12d3-a456-426614174000.jpg",
    "originalFilename": "my-image.jpg",
    "path": "/uploads/60d21b4667d0d8992e610c85/123e4567-e89b-12d3-a456-426614174000.jpg",
    "type": "image",
    "size": 1024000,
    "mimeType": "image/jpeg",
    "url": "http://localhost:3000/uploads/60d21b4667d0d8992e610c85/123e4567-e89b-12d3-a456-426614174000.jpg",
    "createdAt": "2023-06-22T10:00:00.000Z",
    "updatedAt": "2023-06-22T10:00:00.000Z"
  }
}
```

### Rename Media

**Request:**

```
PUT /api/media/manage?id=60d21b4667d0d8992e610c85&newFilename=new-name
```

**Response:**

```json
{
  "success": true,
  "message": "File renamed successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "filename": "new-name.jpg",
    "originalFilename": "my-image.jpg",
    "path": "/uploads/60d21b4667d0d8992e610c85/new-name.jpg",
    "type": "image",
    "size": 1024000,
    "url": "http://localhost:3000/uploads/60d21b4667d0d8992e610c85/new-name.jpg",
    "updatedAt": "2023-06-22T11:00:00.000Z"
  }
}
```

### Replace Media

**Request:**

```
PUT /api/media/manage?id=60d21b4667d0d8992e610c85
```

Use form-data with a file field containing the replacement image or video file.

**Response:**

```json
{
  "success": true,
  "message": "File replaced successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "filename": "123e4567-e89b-12d3-a456-426614174000.jpg",
    "originalFilename": "replacement-image.jpg",
    "path": "/uploads/60d21b4667d0d8992e610c85/123e4567-e89b-12d3-a456-426614174000.jpg",
    "type": "image",
    "size": 2048000,
    "url": "http://localhost:3000/uploads/60d21b4667d0d8992e610c85/123e4567-e89b-12d3-a456-426614174000.jpg",
    "updatedAt": "2023-06-22T12:00:00.000Z"
  }
}
```

### Delete Media

**Request:**

```
DELETE /api/media/manage?id=60d21b4667d0d8992e610c85
```

**Response:**

```json
{
  "success": true,
  "message": "File deleted successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85"
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message description"
}
```

Common error status codes:
- `400`: Bad request (invalid parameters)
- `401`: Unauthorized (invalid or missing token)
- `404`: Resource not found
- `500`: Server error

## Demo

A demo interface is available at:

```
/media-api-demo.html
```

## Getting the Media ID

The media ID is returned in the response when you upload a file. This ID is used to identify the file for all other operations (get, rename, replace, delete).

Example of getting the ID from an upload response:

```javascript
const response = await fetch('/api/media/manage', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
const mediaId = data.data.id; // This is the unique ID for the uploaded file
```

You can also get a list of all your media files and their IDs by making a GET request to `/api/media/manage`.