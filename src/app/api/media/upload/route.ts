import { NextResponse } from 'next/server';
import { getUserFromRequest, verifyToken } from '@/lib/auth';
import { createMedia } from '@/lib/models/media';
import { v4 as uuidv4 } from 'uuid';

// Use the new route segment config format
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Helper function to process the multipart form data
async function processFormData(req: Request) {
  // Process the form data directly
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const customId = formData.get('customId') as string;
  
  if (!file) {
    throw new Error('No file uploaded');
  }
  
  return { file, customId };
}

export async function POST(request: Request) {
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
    const { file, customId } = await processFormData(request);
    
    // Generate a unique filename
    const fileId = customId || uuidv4();
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop() || '';
    const fileName = `${fileId}.${fileExtension}`;
    
    // Convert file to buffer for processing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create media record with Cloudinary upload (passing buffer directly)
    const media = await createMedia({
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
        id: media._id,
        userId: media.userId,
        originalName: media.originalName,
        fileName: media.fileName,
        fileType: media.fileType,
        fileSize: media.fileSize,
        url: media.url,
        customId: customId || media._id,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'File upload failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}