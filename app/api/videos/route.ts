import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const videoDirectory = path.join(process.cwd(), 'public', 'video');
    
    if (!fs.existsSync(videoDirectory)) {
      return NextResponse.json(
        { error: 'Video directory not found' },
        { status: 404 }
      );
    }
    
    const files = fs.readdirSync(videoDirectory);
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    const videoFiles = files.filter(file => 
      videoExtensions.includes(path.extname(file).toLowerCase())
    );
    
    const videos = videoFiles.map(file => ({
      url: `/video/${file}`,
      filename: file
    }));
    
    return NextResponse.json({ videos }, { status: 200 });
    
  } catch (error) {
    console.error('Error reading videos:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve videos' },
      { status: 500 }
    );
  }
}