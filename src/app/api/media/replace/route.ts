import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { findMediaById, deleteMedia, createMedia } from '@/lib/models/media';
import { v4 as uuidv4 } from 'uuid';

// Use the new route segment config format
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Helper function to process the multipart form data
async function processFormData(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const mediaId = formData.get('id') as string;
  
  if (!file || !mediaId) {
    throw new Error('File and media ID are required');
  }
  
  return { file, mediaId };
}

export async function PUT(request: Request) {
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

    // Process the uploaded file
    const { file, mediaId } = await processFormData(request);

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
        { error: 'You do not have permission to replace this media' },
        { status: 403 }
      );
    }

    // Delete the old media (this will also delete from Cloudinary)
    await deleteMedia(mediaId);

    // Process the new file
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop() || '';
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Convert file to buffer for processing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a new media record with the same ID
    const newMedia = await createMedia({
      userId: user.id,
      originalName,
      fileName,
      buffer,
      fileType: file.type,
      fileSize: file.size,
    });

    return NextResponse.json({
      success: true,
      media: {
        id: newMedia._id,
        userId: newMedia.userId,
        originalName: newMedia.originalName,
        fileName: newMedia.fileName,
        url: newMedia.url,
        fileType: newMedia.fileType,
        fileSize: newMedia.fileSize,
      },
    });
  } catch (error) {
    console.error('Replace error:', error);
    return NextResponse.json(
      { error: 'Failed to replace media', details: (error as Error).message },
      { status: 500 }
    );
  }
}