import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '../../../lib/database';
import Media from '../../../lib/models/Media';
import { verifyToken } from '../../../lib/middleware/auth';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to database
  await connectDB();

  // Verify user authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing or invalid format' });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = await verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  const userId = decoded.userId;

  // Handle different HTTP methods
  switch (req.method) {
    case 'POST':
      return handleUpload(req, res, userId);
    case 'PUT':
      return handleUpdate(req, res, userId);
    case 'DELETE':
      return handleDelete(req, res, userId);
    case 'GET':
      return handleGet(req, res, userId);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};

// Handle file upload
async function handleUpload(req: NextApiRequest, res: NextApiResponse, userId: string) {
  // Ensure upload directories exist
  const uploadDir = path.join(process.cwd(), 'apirgram', 'public', 'uploads', userId);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 500 * 1024 * 1024, // 500MB max file size
    multiples: false,
  });

  try {
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Determine file type
    const isVideo = file.mimetype?.startsWith('video/') || 
                   /\.(mp4|avi|mov|wmv|flv|mkv|webm)$/i.test(file.originalFilename || '');
    const isImage = file.mimetype?.startsWith('image/') || 
                   /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file.originalFilename || '');

    if (!isVideo && !isImage) {
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ success: false, message: 'File must be a video or image' });
    }

    // Generate unique filename with UUID
    const fileId = uuidv4();
    const fileExtension = path.extname(file.originalFilename || '');
    const newFilename = `${fileId}${fileExtension}`;
    const destinationPath = path.join(uploadDir, newFilename);

    // Move file to final destination
    fs.copyFileSync(file.filepath, destinationPath);
    fs.unlinkSync(file.filepath); // Clean up temp file

    const stats = fs.statSync(destinationPath);
    const relativePath = path.join('uploads', userId, newFilename).replace(/\\/g, '/');

    // Save file info to database
    const mediaDoc = await Media.create({
      userId,
      filename: newFilename,
      originalFilename: file.originalFilename,
      path: relativePath,
      type: isVideo ? 'video' : 'image',
      size: stats.size,
      mimeType: file.mimetype || '',
    });

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: mediaDoc._id,
        filename: newFilename,
        originalFilename: file.originalFilename,
        path: `/${relativePath}`,
        type: isVideo ? 'video' : 'image',
        size: stats.size,
        url: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/${relativePath}`,
        createdAt: mediaDoc.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'Error processing file' });
  }
}

// Handle file update (rename or replace)
async function handleUpdate(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id, newFilename } = req.query;
  
  if (!id) {
    return res.status(400).json({ success: false, message: 'Media ID is required' });
  }

  try {
    // Find the media file
    const media = await Media.findOne({ _id: id, userId });
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // If this is a rename operation
    if (newFilename) {
      const uploadDir = path.join(process.cwd(), 'apirgram', 'public', 'uploads', userId);
      const currentPath = path.join(uploadDir, media.filename);
      const fileExtension = path.extname(media.filename);
      const sanitizedNewName = String(newFilename).replace(/[^a-zA-Z0-9_-]/g, '_');
      const newFilenameWithExt = `${sanitizedNewName}${fileExtension}`;
      const newPath = path.join(uploadDir, newFilenameWithExt);

      // Rename the file
      if (fs.existsSync(currentPath)) {
        fs.renameSync(currentPath, newPath);
      } else {
        return res.status(404).json({ success: false, message: 'File not found on disk' });
      }

      // Update database record
      const relativePath = path.join('uploads', userId, newFilenameWithExt).replace(/\\/g, '/');
      media.filename = newFilenameWithExt;
      media.path = relativePath;
      await media.save();

      return res.status(200).json({
        success: true,
        message: 'File renamed successfully',
        data: {
          id: media._id,
          filename: media.filename,
          originalFilename: media.originalFilename,
          path: `/${media.path}`,
          type: media.type,
          size: media.size,
          url: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/${media.path}`,
          updatedAt: media.updatedAt
        }
      });
    } else {
      // This is a replace operation, which requires a file upload
      const form = formidable({
        uploadDir: path.join(process.cwd(), 'apirgram', 'public', 'uploads'),
        keepExtensions: true,
        maxFileSize: 500 * 1024 * 1024,
        multiples: false,
      });

      const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      });

      const file = files.file?.[0];
      if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded for replacement' });
      }

      // Determine file type
      const isVideo = file.mimetype?.startsWith('video/') || 
                     /\.(mp4|avi|mov|wmv|flv|mkv|webm)$/i.test(file.originalFilename || '');
      const isImage = file.mimetype?.startsWith('image/') || 
                     /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file.originalFilename || '');

      if (!isVideo && !isImage) {
        fs.unlinkSync(file.filepath);
        return res.status(400).json({ success: false, message: 'File must be a video or image' });
      }

      // Check if the replacement file type matches the original
      const newType = isVideo ? 'video' : 'image';
      if (newType !== media.type) {
        fs.unlinkSync(file.filepath);
        return res.status(400).json({ 
          success: false, 
          message: `Cannot replace ${media.type} with ${newType}. File types must match.` 
        });
      }

      // Delete the old file
      const oldFilePath = path.join(process.cwd(), 'apirgram', 'public', media.path);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Move the new file to the destination with the same filename to preserve links
      const uploadDir = path.join(process.cwd(), 'apirgram', 'public', 'uploads', userId);
      const destinationPath = path.join(uploadDir, media.filename);
      fs.copyFileSync(file.filepath, destinationPath);
      fs.unlinkSync(file.filepath);

      // Update the media record
      const stats = fs.statSync(destinationPath);
      media.originalFilename = file.originalFilename || media.originalFilename;
      media.size = stats.size;
      media.mimeType = file.mimetype || media.mimeType;
      await media.save();

      return res.status(200).json({
        success: true,
        message: 'File replaced successfully',
        data: {
          id: media._id,
          filename: media.filename,
          originalFilename: media.originalFilename,
          path: `/${media.path}`,
          type: media.type,
          size: media.size,
          url: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/${media.path}`,
          updatedAt: media.updatedAt
        }
      });
    }
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ success: false, message: 'Error updating file' });
  }
}

// Handle file deletion
async function handleDelete(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ success: false, message: 'Media ID is required' });
  }

  try {
    // Find the media file
    const media = await Media.findOne({ _id: id, userId });
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // Delete the file from disk
    const filePath = path.join(process.cwd(), 'apirgram', 'public', media.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the database record
    await Media.deleteOne({ _id: id, userId });

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      data: { id: media._id }
    });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting file' });
  }
}

// Handle getting media files
async function handleGet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id } = req.query;

  try {
    if (id) {
      // Get a single media file
      const media = await Media.findOne({ _id: id, userId });
      if (!media) {
        return res.status(404).json({ success: false, message: 'Media not found' });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: media._id,
          filename: media.filename,
          originalFilename: media.originalFilename,
          path: `/${media.path}`,
          type: media.type,
          size: media.size,
          mimeType: media.mimeType,
          url: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/${media.path}`,
          createdAt: media.createdAt,
          updatedAt: media.updatedAt
        }
      });
    } else {
      // Get all media files for the user
      const { page = '1', limit = '10', type } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query: any = { userId };
      if (type === 'image' || type === 'video') {
        query.type = type;
      }

      // Get total count
      const total = await Media.countDocuments(query);

      // Get paginated results
      const mediaFiles = await Media.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      const results = mediaFiles.map(media => ({
        id: media._id,
        filename: media.filename,
        originalFilename: media.originalFilename,
        path: `/${media.path}`,
        type: media.type,
        size: media.size,
        mimeType: media.mimeType,
        url: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/${media.path}`,
        createdAt: media.createdAt,
        updatedAt: media.updatedAt
      }));

      return res.status(200).json({
        success: true,
        data: results,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      });
    }
  } catch (error) {
    console.error('Get media error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving media' });
  }
}

export default handler;