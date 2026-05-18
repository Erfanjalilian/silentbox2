// app/admin/articles/edit/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleForm from '@/app/admin/components/ArticleForm';

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

async function getArticle(id: string): Promise<Article | null> {
  const { getArticleById } = await import('@/lib/data/articles');
  return getArticleById(id);
}

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);
  
  if (!article) {
    notFound();
  }

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
            ویرایش مقاله
          </h1>
        </div>
        <p className="text-gray-400">
          در حال ویرایش مقاله: {article.title}
        </p>
      </div>

      {/* Form */}
      <ArticleForm mode="edit" initialArticle={article} />
    </div>
  );
}