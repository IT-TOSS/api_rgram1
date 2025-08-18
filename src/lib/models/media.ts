import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '../db';
import { uploadToCloudinary, deleteFromCloudinary, renameInCloudinary } from '../cloudinary';
import path from 'path';

export interface MediaFile extends Document {
  userId: string;
  originalName: string;
  fileName: string;
  publicId: string;  // Cloudinary public ID
  url: string;      // Cloudinary URL
  fileType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const mediaSchema = new Schema<MediaFile>(
  {
    userId: { type: String, required: true, index: true },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    publicId: { type: String, required: true },  // Cloudinary public ID
    url: { type: String, required: true },       // Cloudinary URL
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
  },
  { timestamps: true }
);

// Create the model (or get it if it already exists)
const MediaModel = mongoose.models.Media || mongoose.model<MediaFile>('Media', mediaSchema);

// No need for physical upload directory in serverless environment

// Find media by ID
export const findMediaById = async (id: string): Promise<MediaFile | null> => {
  await connectToDatabase();
  return MediaModel.findById(id).exec();
};

// Find media by user ID
export const findMediaByUserId = async (userId: string): Promise<MediaFile[]> => {
  await connectToDatabase();
  return MediaModel.find({ userId }).exec();
};

// Create a new media record with Cloudinary upload
export const createMedia = async (
  mediaData: {
    userId: string;
    originalName: string;
    fileName: string;
    buffer: Buffer;  // File buffer instead of path
    fileType: string;
    fileSize: number;
  }
): Promise<MediaFile> => {
  await connectToDatabase();
  
  // Upload to Cloudinary using buffer
  const customId = uuidv4();
  const cloudinaryResult = await uploadToCloudinary(mediaData.buffer, `media/${mediaData.userId}`, customId) as {
    public_id: string;
    secure_url: string;
  };
  
  // Create media record in database
  const newMedia = new MediaModel({
    userId: mediaData.userId,
    originalName: mediaData.originalName,
    fileName: mediaData.fileName,
    publicId: cloudinaryResult.public_id,
    url: cloudinaryResult.secure_url,
    fileType: mediaData.fileType,
    fileSize: mediaData.fileSize,
  });
  
  return newMedia.save();
};

// Update media record
export const updateMedia = async (id: string, updates: Partial<MediaFile>): Promise<MediaFile | null> => {
  await connectToDatabase();
  return MediaModel.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).exec();
};

// Delete media record and file from Cloudinary
export const deleteMedia = async (id: string): Promise<boolean> => {
  await connectToDatabase();
  
  const media = await MediaModel.findById(id).exec();
  
  if (!media) {
    return false;
  }
  
  // Delete from Cloudinary
  try {
    await deleteFromCloudinary(media.publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
  
  // Remove from the database
  await MediaModel.findByIdAndDelete(id).exec();
  return true;
};

// Rename media in Cloudinary
export const renameMedia = async (id: string, newFileName: string): Promise<MediaFile | null> => {
  await connectToDatabase();
  
  const media = await MediaModel.findById(id).exec();
  
  if (!media) {
    return null;
  }
  
  // Generate new public ID based on the new filename
  const fileExt = path.extname(media.fileName);
  const newFileNameWithExt = newFileName + fileExt;
  
  // Extract folder path and extension from the existing publicId
  const folderPath = media.publicId.substring(0, media.publicId.lastIndexOf('/'));
  const fileExtension = media.publicId.includes('.') ? media.publicId.substring(media.publicId.lastIndexOf('.')) : '';
  const newPublicId = `${folderPath}/${uuidv4()}${fileExtension}`;
  
  // Rename in Cloudinary
  try {
    await renameInCloudinary(media.publicId, newPublicId);
  } catch (error) {
    console.error('Error renaming in Cloudinary:', error);
    return null;
  }
  
  // Update the media record with new information
  const updatedMedia = await MediaModel.findByIdAndUpdate(
    id,
    {
      originalName: newFileName,
      fileName: newFileNameWithExt,
      publicId: newPublicId,
      updatedAt: new Date()
    },
    { new: true }
  ).exec();
  
  console.log('Updated media record:', updatedMedia);
  return updatedMedia;
};

export default MediaModel;