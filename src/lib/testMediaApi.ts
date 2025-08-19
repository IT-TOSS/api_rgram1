/**
 * Test utility for the media upload API
 */

import { getMediaUrl } from './config';

/**
 * Test function to upload a file to the media upload API
 * @param file The file to upload
 * @param token The authentication token
 * @param customId Optional custom ID for the file
 * @param fileType The type of file (image or video)
 * @returns The response from the API
 */
export async function testUploadMedia(file: File, token: string, customId?: string, fileType?: string): Promise<any> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    if (customId) {
      formData.append('customId', customId);
    }
    
    if (fileType) {
      formData.append('fileType', fileType);
    }
    
    const response = await fetch('/api/mediaupload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading media:', error);
    return { error: 'Failed to upload media' };
  }
}

/**
 * Test function to retrieve a media file from the API
 * @param filePath The path to the file
 * @returns The file data
 */
export async function testGetMedia(filePath: string): Promise<Blob> {
  try {
    const response = await fetch(`/api/mediaupload?filePath=${encodeURIComponent(filePath)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to retrieve media: ${response.statusText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error retrieving media:', error);
    throw error;
  }
}

/**
 * Test function to retrieve a media file by ID and type
 * @param fileId The ID of the file
 * @param fileType The type of file (image or video)
 * @returns The file data
 */
export async function testGetMediaById(fileId: string, fileType: 'image' | 'video'): Promise<Blob> {
  try {
    const response = await fetch(`/api/mediaupload?fileId=${encodeURIComponent(fileId)}&fileType=${fileType}`);
    
    if (!response.ok) {
      throw new Error(`Failed to retrieve media: ${response.statusText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error retrieving media by ID:', error);
    throw error;
  }
}

/**
 * Test function to delete a media file
 * @param filePath The path to the file
 * @param token The authentication token
 * @returns The response from the API
 */
export async function testDeleteMedia(filePath: string, token: string): Promise<any> {
  try {
    const response = await fetch(`/api/mediaupload?filePath=${encodeURIComponent(filePath)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting media:', error);
    return { error: 'Failed to delete media' };
  }
}

/**
 * Helper function to create an object URL from a blob
 * @param blob The blob to create a URL for
 * @returns The object URL
 */
export function createObjectURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Helper function to revoke an object URL
 * @param url The URL to revoke
 */
export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url);
}