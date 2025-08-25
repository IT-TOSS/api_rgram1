# Privacy API Documentation

This document describes the Privacy API endpoints that allow users to manage their account privacy settings, similar to Instagram's public/private account functionality.

## Overview

The Privacy API provides two main endpoints:
1. **`/api/user/privacy`** - Comprehensive privacy management (GET/PUT)
2. **`/api/user/toggle-privacy`** - Simple toggle between public/private (PUT)

## Authentication

All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### 1. Privacy Management API (`/api/user/privacy`)

#### GET - View Current Privacy Status

Retrieves the current privacy status and detailed information about what it means.

**Endpoint:** `GET /api/user/privacy`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "username",
      "fullName": "Full Name",
      "isPrivate": false,
      "followersCount": 150,
      "followingCount": 200
    },
    "privacyInfo": {
      "currentStatus": "public",
      "description": "Your account is public. Anyone can see your posts and profile.",
      "implications": [
        "Anyone can see your posts and profile",
        "Your content appears in public searches",
        "Anyone can follow you without approval",
        "Maximum visibility and discoverability"
      ]
    }
  }
}
```

#### PUT - Update Privacy Status

Sets the account to a specific privacy level.

**Endpoint:** `PUT /api/user/privacy`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "isPrivate": true
}
```

**Parameters:**
- `isPrivate` (boolean, required): 
  - `true` = Private account
  - `false` = Public account

**Response:**
```json
{
  "success": true,
  "message": "Account privacy updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "username",
      "fullName": "Full Name",
      "isPrivate": true,
      "followersCount": 150,
      "followingCount": 200
    },
    "privacyChanged": {
      "previousStatus": false,
      "newStatus": true,
      "message": "Your account is now private. Only approved followers can see your posts and profile.",
      "implications": [
        "Only approved followers can see your posts",
        "Profile information is limited to followers",
        "New followers must be approved by you",
        "Your content won't appear in public searches"
      ]
    }
  }
}
```

### 2. Toggle Privacy API (`/api/user/toggle-privacy`)

#### PUT - Toggle Privacy Status

Switches the account between public and private (opposite of current status).

**Endpoint:** `PUT /api/user/toggle-privacy`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:** Empty (no body required)

**Response:**
```json
{
  "success": true,
  "message": "Account is now private",
  "data": {
    "user": {
      "id": "user_id",
      "username": "username",
      "fullName": "Full Name",
      "isPrivate": true,
      "followersCount": 150,
      "followingCount": 200
    },
    "privacyChanged": {
      "previousStatus": false,
      "newStatus": true,
      "message": "Your account is now private. Only approved followers can see your posts and profile."
    }
  }
}
```

## Privacy Levels

### Public Account (`isPrivate: false`)
- **Visibility:** Anyone can see posts and profile
- **Discovery:** Content appears in public searches
- **Following:** Anyone can follow without approval
- **Content:** All posts are publicly visible
- **Profile:** Full profile information is visible

### Private Account (`isPrivate: true`)
- **Visibility:** Only approved followers can see posts
- **Discovery:** Content doesn't appear in public searches
- **Following:** New followers must be approved
- **Content:** Posts are limited to followers
- **Profile:** Limited profile information for non-followers

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 401 Invalid Token
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "isPrivate must be a boolean value (true for private, false for public)"
}
```

### 404 User Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 405 Method Not Allowed
```json
{
  "success": false,
  "message": "Method not allowed. Use GET to view privacy status or PUT to update it."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development)"
}
```

## Usage Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

// Get current privacy status
async function getPrivacyStatus(token) {
  try {
    const response = await axios.get('http://localhost:5001/api/user/privacy', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Set account to private
async function setPrivateAccount(token) {
  try {
    const response = await axios.put('http://localhost:5001/api/user/privacy', {
      isPrivate: true
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Toggle privacy status
async function togglePrivacy(token) {
  try {
    const response = await axios.put('http://localhost:5001/api/user/toggle-privacy', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}
```

### cURL

```bash
# Get privacy status
curl -X GET "http://localhost:5001/api/user/privacy" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Set to private
curl -X PUT "http://localhost:5001/api/user/privacy" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isPrivate": true}'

# Toggle privacy
curl -X PUT "http://localhost:5001/api/user/toggle-privacy" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Postman Collection

You can import the following collection into Postman:

```json
{
  "info": {
    "name": "Privacy API",
    "description": "API endpoints for managing user account privacy"
  },
  "item": [
    {
      "name": "Get Privacy Status",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer YOUR_TOKEN",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:5001/api/user/privacy",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5001",
          "path": ["api", "user", "privacy"]
        }
      }
    },
    {
      "name": "Set Private Account",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer YOUR_TOKEN",
            "type": "text"
          },
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"isPrivate\": true\n}"
        },
        "url": {
          "raw": "http://localhost:5001/api/user/privacy",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5001",
          "path": ["api", "user", "privacy"]
        }
      }
    },
    {
      "name": "Toggle Privacy",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer YOUR_TOKEN",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:5001/api/user/toggle-privacy",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5001",
          "path": ["api", "user", "toggle-privacy"]
        }
      }
    }
  ]
}
```

## Testing

Use the provided test file `test-privacy-api.js` to test all endpoints:

```bash
# Install dependencies
npm install axios

# Run tests (set TEST_TOKEN first)
node test-privacy-api.js
```

## Security Considerations

1. **Authentication Required:** All endpoints require valid JWT tokens
2. **User Isolation:** Users can only modify their own privacy settings
3. **Input Validation:** Strict validation of boolean values for privacy settings
4. **Audit Trail:** Privacy changes are logged and tracked

## Database Schema

The privacy setting is stored in the User model:

```typescript
interface IUser {
  // ... other fields
  isPrivate: boolean; // Default: false (public)
  // ... other fields
}
```

## Integration Notes

1. **Frontend Integration:** Use these APIs to build privacy toggle switches
2. **Real-time Updates:** Consider WebSocket integration for real-time privacy status updates
3. **Caching:** Cache privacy status to reduce API calls
4. **Analytics:** Track privacy changes for user behavior analysis

## Support

For issues or questions regarding the Privacy API, please refer to the main project documentation or create an issue in the project repository.
