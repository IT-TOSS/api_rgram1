# Uploads Directory

This directory is used to store uploaded media files (images and videos) from the Media API.

The structure will be automatically created as follows when users upload files:

```
uploads/
  ├── [userId1]/
  │   ├── [file1.jpg]
  │   ├── [file2.mp4]
  │   └── ...
  ├── [userId2]/
  │   ├── [file1.jpg]
  │   └── ...
  └── ...
```

Each user's files are stored in a separate directory named with their user ID for proper isolation and access control.

**Note:** This directory should be excluded from version control using .gitignore, but the directory structure should be maintained.