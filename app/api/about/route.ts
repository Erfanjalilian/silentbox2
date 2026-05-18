// app/api/about/route.ts
import { NextResponse } from 'next/server';
import { aboutData } from '@/lib/data/about';

export async function GET() {
  try {
    return NextResponse.json(aboutData, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=180',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch about page data' },
      { status: 500 }
    );
  }
}

// Optional: PUT endpoint for admin to update about page content
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    // In a real app, you would save this to a database
    const updatedData = { ...aboutData, ...body };
    
    return NextResponse.json(updatedData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update about page data' },
      { status: 500 }
    );
  }
}