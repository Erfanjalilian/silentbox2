// components/Articles.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PhotoIcon, 
  ClockIcon, 
  CalendarIcon, 
  UserIcon,
  TagIcon 
} from '@heroicons/react/24/outline';

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

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  console.log(3)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articles');
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        setArticles(data);
        setError(null);
      } catch (err) {
        setError('مشکلی در بارگذاری مقالات پیش آم است');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleImageError = (articleId: string) => {
    setImageErrors(prev => ({ ...prev, [articleId]: true }));
  };

  const hasImage = (article: Article) => {
    return article.imageUrl && article.imageUrl.trim() !== '' && !imageErrors[article.id];
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">مقالات تخصصی</h2>
            <div className="w-20 h-1 bg-sky-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
                <div className="h-48 bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-700 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-700 rounded mb-4 w-2/3"></div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            مقالات تخصصی استخراج
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            جدیدترین مقالات و راهنماهای استخراج ارزهای دیجیتال
          </p>
          <div className="w-20 h-1 bg-sky-500 mx-auto mt-4"></div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-sky-500/50 transition-all duration-300 hover:transform hover:scale-105 group"
            >
              {/* Article Image or Icon Placeholder */}
              <Link href={`/articles/${article.id}`} className="block">
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
                  {hasImage(article) ? (
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={() => handleImageError(article.id)}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <PhotoIcon className="h-16 w-16 text-sky-500/30 mb-2" />
                      <p className="text-gray-500 text-sm">تصویر در حال بارگذاری</p>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-sky-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Article Content */}
              <div className="p-6">
                <Link href={`/articles/${article.id}`}>
                  <h3 className="text-xl font-bold text-gray-100 mb-3 hover:text-sky-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>
                
                {/* Article Metadata */}
                <div className="flex flex-wrap gap-4 text-gray-500 text-xs mb-4">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4 text-sky-400" />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-sky-400" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4 text-sky-400" />
                    <span>{article.author}</span>
                  </div>
                </div>
                
                {/* Read More Link */}
                <Link
                  href={`/articles/${article.id}`}
                  className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 font-medium text-sm transition-colors"
                >
                  مطالعه بیشتر
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        {/* View All Articles Button */}
        <div className="text-center mt-12">
          <Link
            href="/articles"
            className="inline-block bg-transparent border-2 border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
          >
            مشاهده تمام مقالات
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Articles;