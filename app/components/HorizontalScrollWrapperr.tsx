// components/HorizontalScrollWrapper.tsx
'use client';

import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface HorizontalScrollWrapperProps {
  children: React.ReactNode;
}

export default function HorizontalScrollWrapper({ children }: HorizontalScrollWrapperProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* دکمه اسکرول راست - فقط در دسکتاپ */}
      <button
        onClick={() => scroll('right')}
        className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-700 hover:bg-sky-500 text-white rounded-full p-2 shadow-lg transition-all duration-300"
        aria-label="اسکرول به راست"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
      
      {/* دکمه اسکرول چپ - فقط در دسکتاپ */}
      <button
        onClick={() => scroll('left')}
        className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-700 hover:bg-sky-500 text-white rounded-full p-2 shadow-lg transition-all duration-300"
        aria-label="اسکرول به چپ"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      
      {/* کانتینر اسکرول افقی */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 scroll-smooth"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
          WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
        }}
      >
        {children}
      </div>
      
      {/* استایل مخفی کردن اسکرول بار */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}