'use client';

import React, { useState } from 'react';
import { Video } from '@/app/videos/page';

interface VideosClientProps {
  initialVideos: Video[];
}

const VideosClient: React.FC<VideosClientProps> = ({ initialVideos }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openVideoModal = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // Helper function to format filename for display
  const formatVideoTitle = (filename: string) => {
    // Remove extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    // Replace dashes and underscores with spaces
    const withSpaces = nameWithoutExt.replace(/[-_]/g, ' ');
    // Capitalize first letter of each word
    return withSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialVideos.map((video, index) => (
            <div
              key={index}
              className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-sky-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
              onClick={() => openVideoModal(video)}
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                <video
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  src={video.url}
                  preload="metadata"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="text-gray-200 font-semibold text-lg mb-1 line-clamp-1">
                  {formatVideoTitle(video.filename)}
                </h3>
                <p className="text-gray-400 text-sm">
                  ویدیو تست صدا
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sky-400 text-sm group-hover:text-sky-300 transition-colors">
                    پخش ویدیو →
                  </span>
                  <span className="text-gray-500 text-xs">
                    {video.filename.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={closeVideoModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl w-full max-w-5xl border border-sky-500/30 shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sky-500/30">
              <h3 className="text-gray-200 font-semibold text-lg">
                {formatVideoTitle(selectedVideo.filename)}
              </h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Video Player */}
            <div className="p-4">
              <video
                className="w-full rounded-lg"
                controls
                autoPlay
                src={selectedVideo.url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-sky-500/30">
              <p className="text-gray-400 text-sm">
                نام فایل: {selectedVideo.filename}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default VideosClient;