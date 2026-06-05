import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // Await the params Promise to get the filename
    const { filename } = await params;
    const filePath = path.join(process.cwd(), 'public', 'video', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    // Get file stats for range requests
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.get('range');
    
    // Handle range requests (for video streaming)
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      
      const headers = new Headers({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': 'video/mp4',
      });
      
      return new NextResponse(file as any, { 
        status: 206, 
        headers 
      });
    }
    
    // Return full file if no range request
    const file = fs.createReadStream(filePath);
    const headers = new Headers({
      'Content-Length': fileSize.toString(),
      'Content-Type': 'video/mp4',
    });
    
    return new NextResponse(file as any, { 
      status: 200, 
      headers 
    });
    
  } catch (error) {
    console.error('Error streaming video:', error);
    return NextResponse.json(
      { error: 'Failed to stream video' },
      { status: 500 }
    );
  }
}