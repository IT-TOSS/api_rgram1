import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { findMediaById, renameMedia } from '@/lib/models/media';

export async function PATCH(request: Request) {
  try {
    // Authenticate user
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { mediaId, newName } = body;

    // Validate input
    if (!mediaId || !newName) {
      return NextResponse.json(
        { error: 'Media ID and new name are required' },
        { status: 400 }
      );
    }

    // Find the media
    const media = await findMediaById(mediaId);
    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    // Check if the user owns the media
    if (media.userId !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to rename this media' },
        { status: 403 }
      );
    }

    // Rename the media in Cloudinary and update the database
    const updatedMedia = await renameMedia(mediaId, newName);
    if (!updatedMedia) {
      return NextResponse.json(
        { error: 'Failed to rename media' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      media: {
        id: updatedMedia._id,
        userId: updatedMedia.userId,
        originalName: updatedMedia.originalName,
        fileName: updatedMedia.fileName,
        url: updatedMedia.url,
        fileType: updatedMedia.fileType,
        fileSize: updatedMedia.fileSize,
      },
    });
  } catch (error) {
    console.error('Rename error:', error);
    return NextResponse.json(
      { error: 'Failed to rename media', details: (error as Error).message },
      { status: 500 }
    );
  }
}