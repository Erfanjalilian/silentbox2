// components/Hero.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface HeroData {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const Hero: React.FC = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/hero');
        
        if (!response.ok) {
          throw new Error('Failed to fetch hero data');
        }
        
        const data = await response.json();
        setHeroData(data);
        setError(null);
      } catch (err) {
        setError('مشکلی در بارگذاری اطلاعات پیش آم است');
        console.error('Error fetching hero data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const hasImage = heroData?.imageUrl && heroData.imageUrl.trim() !== '' && !imageError;

  if (loading) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
          <p className="text-gray-100 mt-4">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !heroData) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || 'خطا در بارگذاری'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background - Image or Icon Placeholder */}
      {hasImage ? (
        <>
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={heroData.imageUrl}
              alt={heroData.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={90}
              onError={() => setImageError(true)}
            />
          </div>
          {/* Dark Semi-transparent Overlay with RGBA */}
          <div className="absolute inset-0 bg-black/60"></div>
        </>
      ) : (
        <>
          {/* Gradient Background when no image */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          {/* Icon Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <PhotoIcon className="h-32 w-32 md:h-48 md:w-48 text-sky-500/30 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">تصویر در حال بارگذاری</p>
            </div>
          </div>
          {/* Semi-transparent overlay for icon section */}
          <div className="absolute inset-0 bg-black/40"></div>
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Title with animation */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in-up">
            {heroData.title}
          </h1>
          
          {/* Subtitle */}
          {heroData.subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              {heroData.subtitle}
            </p>
          )}
          
          {/* CTA Button */}
          <Link
            href={heroData.buttonLink}
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400"
          >
            {heroData.buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;