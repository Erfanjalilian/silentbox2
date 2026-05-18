// app/articles/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PhotoIcon, ClockIcon, CalendarIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
}

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: params.id }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        
        const data = await response.json();
        setArticle(data);
        setError(null);
      } catch (err) {
        setError('مشکلی در بارگذاری مقاله پیش آم است');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="h-64 bg-gray-800 rounded-xl animate-pulse mb-8"></div>
            <div className="h-8 bg-gray-800 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500 text-lg">{error || 'مقاله یافت نشد'}</p>
          <Link href="/" className="inline-block mt-4 text-orange-500 hover:text-orange-400">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

  const hasImage = article.imageUrl && article.imageUrl.trim() !== '' && !imageError;

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 mb-6">
            <ArrowRightIcon className="h-4 w-4" />
            بازگشت به صفحه اصلی
          </Link>
          
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {article.category}
              </span>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-2 text-gray-400">
              <UserIcon className="h-5 w-5" />
              <span>نویسنده: {article.author}</span>
            </div>
          </div>
          
          {/* Article Image */}
          <div className="relative h-96 w-full rounded-xl overflow-hidden mb-8 bg-gray-800">
            {hasImage ? (
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <PhotoIcon className="h-24 w-24 text-orange-500/30 mb-4" />
                <p className="text-gray-500">تصویری برای این مقاله موجود نیست</p>
              </div>
            )}
          </div>
          
          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 leading-relaxed">
              {article.content}
            </p>
            {/* Add more content sections as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}