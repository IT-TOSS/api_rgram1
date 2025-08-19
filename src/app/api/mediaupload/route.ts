import { NextResponse } from 'next/server';
import { getUserFromRequest, verifyToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { generateUniqueFilename, getMimeType } from '@/lib/fileUtils';

// Use the new route segment config format
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Helper function to process the multipart form data
async function processFormData(req: Request) {
  // Process the form data directly
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const customId = formData.get('customId') as string;
  const fileType = formData.get('fileType') as string || 'image'; // Default to image if not specified
  
  if (!file) {
    throw new Error('No file uploaded');
  }
  
  return { file, customId, fileType };
}

// Helper function to save file to local storage
async function saveFileToLocal(file: File, fileType: string, customId?: string): Promise<{ fileName: string, filePath: string, fileSize: number }> {
  // Convert file to buffer for processing
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Generate a unique filename
  const fileName = generateUniqueFilename(file.name, customId);
  
  // Determine the upload directory based on file type
  let uploadDir = '';
  if (file.type.startsWith('image/')) {
    uploadDir = path.join(process.cwd(), 'public', 'upload', 'image');
  } else if (file.type.startsWith('video/')) {
    uploadDir = path.join(process.cwd(), 'public', 'upload', 'video');
  } else {
    // Default to image directory for other file types
    uploadDir = path.join(process.cwd(), 'public', 'upload', 'image');
  }
  
  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Create the file path
  const filePath = path.join(uploadDir, fileName);
  
  // Write the file to disk
  fs.writeFileSync(filePath, buffer);
  
  return {
    fileName,
    filePath: `/upload/${file.type.startsWith('image/') ? 'image' : 'video'}/${fileName}`,
    fileSize: file.size
  };
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
    const { file, customId, fileType } = await processFormData(request);
    
    // Save file to local storage
    const { fileName, filePath, fileSize } = await saveFileToLocal(file, fileType, customId);
    
    // Create response with file information
    return NextResponse.json({
      success: true,
      media: {
        userId: user.id,
        originalName: file.name,
        fileName,
        filePath,
        fileType: file.type,
        fileSize,
        url: filePath, // URL to access the file
        customId: customId || uuidv4(),
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Provide more detailed error information
    let errorMessage = 'File upload failed';
    let errorDetails = (error as Error).message;
    let statusCode = 500;
    
    // Handle specific error cases
    if (errorDetails.includes('File size exceeds')) {
      errorMessage = 'File too large';
      statusCode = 413; // Payload Too Large
    } else if (errorDetails.includes('Invalid file type')) {
      errorMessage = 'Invalid file type';
      statusCode = 415; // Unsupported Media Type
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

// Handle DELETE request to delete a file
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

    // Get file path from URL parameters
    const url = new URL(request.url);
    const filePath = url.searchParams.get('filePath');
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }
    
    // Construct the full path to the file
    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Delete the file
    fs.unlinkSync(fullPath);
    
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    
    return NextResponse.json(
      { 
        error: 'File deletion failed', 
        details: (error as Error).message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}