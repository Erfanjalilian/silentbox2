// app/admin/articles/add/page.tsx
import React from 'react';
import Link from 'next/link';
import ArticleForm from '@/app/admin/components/ArticleForm';

export default function AddArticlePage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Link
            href="/admin/articles"
            className="text-sky-400 hover:text-sky-300 transition-colors"
          >
            ← بازگشت
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
            افزودن مقاله جدید
          </h1>
        </div>
        <p className="text-gray-400">
          اطلاعات مقاله جدید را وارد کنید
        </p>
      </div>

      {/* Form */}
      <ArticleForm mode="add" />
    </div>
  );
}