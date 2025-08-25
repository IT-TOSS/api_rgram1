# 🔒 Working Privacy API Documentation

This document describes the **WORKING** Privacy API endpoints that allow users to manage their account privacy settings using their user ID.

## 🚀 **API Endpoints**

### 1. **Get Privacy Status**
```
GET /api/user/{USER_ID}/privacy
```

### 2. **Set Privacy Status**
```
PUT /api/user/{USER_ID}/privacy
```

### 3. **Toggle Privacy Status**
```
PUT /api/user/{USER_ID}/toggle-privacy
```

## 🔑 **Authentication**

All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📋 **API Details**

### **1. Get Privacy Status**
**URL:** `GET /api/user/{USER_ID}/privacy`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Example URL:** `http://localhost:3000/api/user/64f8a1b2c3d4e5f6a7b8c9d0/privacy`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "fullName": "John Doe",
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

### **2. Set Account to Private**
**URL:** `PUT /api/user/{USER_ID}/privacy`

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

**Example URL:** `http://localhost:3000/api/user/64f8a1b2c3d4e5f6a7b8c9d0/privacy`

**Response:**
```json
{
  "success": true,
  "message": "Account privacy updated successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "fullName": "John Doe",
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

### **3. Set Account to Public**
**URL:** `PUT /api/user/{USER_ID}/privacy`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "isPrivate": false
}
```

**Example URL:** `http://localhost:3000/api/user/64f8a1b2c3d4e5f6a7b8c9d0/privacy`

**Response:**
```json
{
  "success": true,
  "message": "Account privacy updated successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "fullName": "John Doe",
      "isPrivate": false,
      "followersCount": 150,
      "followingCount": 200
    },
    "privacyChanged": {
      "previousStatus": true,
      "newStatus": false,
      "message": "Your account is now public. Anyone can see your posts and profile.",
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

### **4. Toggle Privacy Status**
**URL:** `PUT /api/user/{USER_ID}/toggle-privacy`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:** Empty (no body required)

**Example URL:** `http://localhost:3000/api/user/64f8a1b2c3d4e5f6a7b8c9d0/toggle-privacy`

**Response:**
```json
{
  "success": true,
  "message": "Account is now private",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "fullName": "John Doe",
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

## 🧪 **Testing with cURL**

### **Get Privacy Status:**
```bash
curl -X GET "http://localhost:3000/api/user/YOUR_USER_ID/privacy" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### **Set Account to Private:**
```bash
curl -X PUT "http://localhost:3000/api/user/YOUR_USER_ID/privacy" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isPrivate": true}'
```

### **Set Account to Public:**
```bash
curl -X PUT "http://localhost:3000/api/user/YOUR_USER_ID/privacy" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isPrivate": false}'
```

### **Toggle Privacy:**
```bash
curl -X PUT "http://localhost:3000/api/user/YOUR_USER_ID/toggle-privacy" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## 🧪 **Testing with JavaScript/Node.js**

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const USER_ID = 'YOUR_USER_ID_HERE';
const TOKEN = 'YOUR_JWT_TOKEN_HERE';

// Get privacy status
async function getPrivacyStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/${USER_ID}/privacy`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Privacy Status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Set account to private
async function setPrivateAccount() {
  try {
    const response = await axios.put(`${BASE_URL}/api/user/${USER_ID}/privacy`, {
      isPrivate: true
    }, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Set Private:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Toggle privacy
async function togglePrivacy() {
  try {
    const response = await axios.put(`${BASE_URL}/api/user/${USER_ID}/toggle-privacy`, {}, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Toggle Privacy:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Run tests
async function testAll() {
  await getPrivacyStatus();
  await setPrivateAccount();
  await getPrivacyStatus();
  await togglePrivacy();
  await getPrivacyStatus();
}

testAll();
```

## 🧪 **Testing with Postman**

### **Collection Variables:**
- `BASE_URL`: `http://localhost:3000`
- `USER_ID`: `YOUR_USER_ID_HERE`
- `JWT_TOKEN`: `YOUR_JWT_TOKEN_HERE`

### **Request URLs:**
1. **Get Privacy:** `{{BASE_URL}}/api/user/{{USER_ID}}/privacy`
2. **Set Private:** `{{BASE_URL}}/api/user/{{USER_ID}}/privacy`
3. **Set Public:** `{{BASE_URL}}/api/user/{{USER_ID}}/privacy`
4. **Toggle Privacy:** `{{BASE_URL}}/api/user/{{USER_ID}}/toggle-privacy`

## 🔒 **Privacy Levels**

### **Public Account** (`isPrivate: false`)
- ✅ Anyone can see posts and profile
- ✅ Content appears in public searches
- ✅ Anyone can follow without approval
- ✅ Maximum visibility and discoverability

### **Private Account** (`isPrivate: true`)
- 🔒 Only approved followers can see posts
- 🔒 Content doesn't appear in public searches
- 🔒 New followers must be approved
- 🔒 Limited profile information for non-followers

## ⚠️ **Important Notes**

1. **Replace Placeholders:**
   - `YOUR_USER_ID_HERE` → Actual user ID from your database
   - `YOUR_JWT_TOKEN_HERE` → Valid JWT token from login

2. **Server URL:**
   - Change `localhost:3000` to your actual server URL if different

3. **User ID Format:**
   - User ID should be a valid MongoDB ObjectId (24 character hex string)
   - Example: `64f8a1b2c3d4e5f6a7b8c9d0`

4. **Security:**
   - Users can only modify their own privacy settings
   - JWT token must be valid and not expired
   - User ID in URL must match the authenticated user

## 🚀 **Quick Start**

1. **Get your User ID** from the database or user profile
2. **Get your JWT Token** by logging in
3. **Test the API** using one of the methods above
4. **Use in your app** to build privacy toggle functionality

## 📝 **Example Usage in Frontend**

```javascript
// React component example
const PrivacyToggle = ({ userId, token }) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePrivacy = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user/${userId}/toggle-privacy`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setIsPrivate(data.data.user.isPrivate);
      }
    } catch (error) {
      console.error('Error toggling privacy:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={togglePrivacy} 
      disabled={loading}
      className={isPrivate ? 'private' : 'public'}
    >
      {isPrivate ? '🔒 Private' : '🌐 Public'}
    </button>
  );
};
```

## 🎯 **Success!**

Your Privacy API is now working! Users can:
- ✅ View their current privacy status
- ✅ Set their account to public or private
- ✅ Toggle between public and private
- ✅ Get detailed information about privacy implications

The API uses user ID in the URL for better security and follows RESTful principles.
