// app/admin/components/AdminArticlesClient.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

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

interface AdminArticlesClientProps {
  initialArticles: Article[];
}

const AdminArticlesClient: React.FC<AdminArticlesClientProps> = ({ initialArticles }) => {
  const [articles, setArticles] = useState(initialArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedArticle) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/articles/${selectedArticle.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setArticles(articles.filter(a => a.id !== selectedArticle.id));
        setShowDeleteModal(false);
        setSelectedArticle(null);
      } else {
        alert('خطا در حذف مقاله');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('خطا در ارتباط با سرور');
    } finally {
      setDeleting(false);
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'آموزشی': 'bg-blue-500/20 text-blue-400',
      'تجهیزات': 'bg-purple-500/20 text-purple-400',
      'محیط زیست': 'bg-green-500/20 text-green-400',
      'تحلیل': 'bg-orange-500/20 text-orange-400',
      'بررسی': 'bg-yellow-500/20 text-yellow-400',
      'راهنما': 'bg-sky-500/20 text-sky-400',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <>
      {/* Search Bar */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
        <input
          type="text"
          placeholder="جستجوی مقاله بر اساس عنوان یا دسته‌بندی..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 placeholder-gray-500"
        />
      </div>

      {/* Articles Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="text-right p-4 text-gray-300 font-semibold">عنوان</th>
                <th className="text-right p-4 text-gray-300 font-semibold">دسته‌بندی</th>
                <th className="text-right p-4 text-gray-300 font-semibold">نویسنده</th>
                <th className="text-right p-4 text-gray-300 font-semibold">تاریخ</th>
                <th className="text-right p-4 text-gray-300 font-semibold">زمان مطالعه</th>
                <th className="text-right p-4 text-gray-300 font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-gray-100 font-medium">{article.title}</p>
                      <p className="text-gray-500 text-sm line-clamp-1">{article.summary}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400 text-sm">{article.author}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400 text-sm">{article.date}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400 text-sm">{article.readTime}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/articles/edit/${article.id}`}
                        className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedArticle(article);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <Link
                        href={`/articles/${article.id}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">مقاله‌ای یافت نشد</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-gray-100 mb-4">حذف مقاله</h3>
            <p className="text-gray-400 mb-6">
              آیا از حذف مقاله &quot;{selectedArticle.title}&quot; اطمینان دارید؟
              <br />
              <span className="text-red-400 text-sm">این عملیات غیرقابل بازگشت است.</span>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? 'در حال حذف...' : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminArticlesClient;