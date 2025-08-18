import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Generate a unique filename
export const generateUniqueFilename = (originalName: string, customId?: string): string => {
  const fileId = customId || uuidv4();
  const fileExtension = path.extname(originalName);
  return `${fileId}${fileExtension}`;
};

// Get mime type from file name
export const getMimeType = (fileName: string): string => {
  const extension = path.extname(fileName).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};