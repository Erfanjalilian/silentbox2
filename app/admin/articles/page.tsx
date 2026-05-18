// app/admin/articles/page.tsx
import React, { Suspense } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import AdminArticlesClient from '@/app/admin/components/AdminArticlesClient';

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

async function getAllArticles(): Promise<Article[]> {
  const { readArticles } = await import('@/lib/data/articles');
  return readArticles();
}

function ArticlesLoading() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-96 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-gray-700 rounded w-64"></div>
                <div className="h-4 bg-gray-700 rounded w-96"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-700 rounded w-16"></div>
                <div className="h-8 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
              مدیریت مقالات
            </h1>
            <p className="text-gray-400">
              مدیریت، ویرایش و افزودن مقالات وبلاگ
            </p>
          </div>
          <Link
            href="/admin/articles/add"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            <PlusIcon className="h-5 w-5" />
            مقاله جدید
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      <Suspense fallback={<ArticlesLoading />}>
        <AdminArticlesClient initialArticles={articles} />
      </Suspense>
    </div>
  );
}