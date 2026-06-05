import React, { Suspense } from 'react';
import Link from 'next/link';
import VideosClient from '@/app/components/VideosClient';

// Video type definition
export interface Video {
  url: string;
  filename: string;
}

export interface VideosResponse {
  videos: Video[];
}

// Function to fetch videos from API
async function getVideos(): Promise<VideosResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/videos`, {
      cache: 'no-store',
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { videos: [] };
  }
}

// Loading skeleton component
function VideosLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-10 bg-gray-800 rounded-lg w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
              <div className="aspect-video bg-gray-700"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Error component
function VideosError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">🎬</div>
        <p className="text-red-500 text-lg mb-4">{message}</p>
        <Link href="/" className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition-all duration-300">
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}

// Main videos page (Server Component)
export default async function VideosPage() {
  try {
    const { videos } = await getVideos();

    if (!videos || videos.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="h-16 md:h-20"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📹</div>
              <h2 className="text-2xl font-bold text-gray-300 mb-2">ویدیویی یافت نشد</h2>
              <p className="text-gray-400 mb-6">در حال حاضر هیچ ویدیویی در سایت وجود ندارد</p>
              <Link href="/" className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition-all duration-300">
                بازگشت به خانه
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Header Spacer */}
        <div className="h-16 md:h-20"></div>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 border-b border-sky-500/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
              ویدیوهای تست صدا
            </h1>
            <p className="text-gray-400">
              {videos.length} ویدیو برای نمایش وجود دارد
            </p>
          </div>
        </div>

        {/* Videos Section */}
        <Suspense fallback={<VideosLoading />}>
          <VideosClient initialVideos={videos} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error in VideosPage:', error);
    return <VideosError message="خطا در بارگذاری ویدیوها" />;
  }
}