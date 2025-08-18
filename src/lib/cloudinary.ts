import { v2 as cloudinary } from 'cloudinary';
import { config } from './config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

/**
 * Upload a file to Cloudinary
 * @param fileData - File data (can be a path string or Buffer)
 * @param folder - Folder to upload to in Cloudinary
 * @param customId - Custom public ID for the file (optional)
 * @returns Cloudinary upload response
 */
export const uploadToCloudinary = async (
  fileData: string | Buffer,
  folder: string = 'media',
  customId?: string
) => {
  try {
    const options: any = {
      folder,
      resource_type: 'auto', // auto-detect file type
    };

    // Use custom ID if provided
    if (customId) {
      options.public_id = customId;
    }

    let result;
    if (Buffer.isBuffer(fileData)) {
      // If fileData is a Buffer, use upload_stream with a Promise
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        
        // Convert Buffer to Stream and pipe to uploadStream
        const { Readable } = require('stream');
        const readableStream = new Readable();
        readableStream.push(fileData);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    } else {
      // If fileData is a path string, use regular upload
      result = await cloudinary.uploader.upload(fileData, options);
    }
    
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param publicId - Public ID of the file to delete
 * @returns Cloudinary deletion response
 */
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Rename a file in Cloudinary
 * @param oldPublicId - Current public ID of the file
 * @param newPublicId - New public ID for the file
 * @returns Cloudinary rename response
 */
export const renameInCloudinary = async (oldPublicId: string, newPublicId: string) => {
  try {
    console.log('Renaming in Cloudinary:', { oldPublicId, newPublicId });
    // Determine resource type based on file extension
    const fileExtension = oldPublicId.includes('.') ? oldPublicId.substring(oldPublicId.lastIndexOf('.') + 1).toLowerCase() : '';
    
    // Set resource type based on extension
    let resourceType = 'image';
    if (['json', 'txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'sql'].includes(fileExtension)) {
      resourceType = 'raw';
    } else if (['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'].includes(fileExtension)) {
      resourceType = 'video';
    }
    
    console.log('Using resource type:', resourceType);
    const result = await cloudinary.uploader.rename(oldPublicId, newPublicId, { resource_type: resourceType });
    console.log('Cloudinary rename result:', result);
    return result;
  } catch (error) {
    console.error('Cloudinary rename error:', error);
    throw error;
  }
};

/**
 * Get a signed URL for a Cloudinary resource
 * @param publicId - Public ID of the file
 * @param options - Additional options for the URL
 * @returns Signed URL
 */
export const getSignedUrl = (publicId: string, options: any = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    ...options,
  });
};

export default cloudinary;