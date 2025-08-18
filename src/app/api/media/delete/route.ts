import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { deleteMedia, findMediaById } from '@/lib/models/media';

export async function DELETE(request: Request) {
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

    // Get media ID from the request
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('id');

    if (!mediaId) {
      return NextResponse.json(
        { error: 'Media ID is required' },
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
        { error: 'You do not have permission to delete this media' },
        { status: 403 }
      );
    }

    // Delete the media (this will also delete from Cloudinary)
    const deleted = await deleteMedia(mediaId);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete media' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete media', details: (error as Error).message },
      { status: 500 }
    );
  }
}