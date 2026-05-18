// app/admin/components/ArticleForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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

interface ArticleFormProps {
  mode: 'add' | 'edit';
  initialArticle?: Article;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ mode, initialArticle }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set today's date in Persian format
  const getTodayDate = () => {
    const today = new Date();
    const persianDate = today.toLocaleDateString('fa-IR');
    return persianDate;
  };

  const [formData, setFormData] = useState({
    title: initialArticle?.title || '',
    summary: initialArticle?.summary || '',
    content: initialArticle?.content || '',
    imageUrl: initialArticle?.imageUrl || '',
    category: initialArticle?.category || 'آموزشی',
    readTime: initialArticle?.readTime || '۵ دقیقه',
    date: initialArticle?.date || getTodayDate(),
    author: initialArticle?.author || 'عرفان جلیلیان',
  });

  const categories = [
    'آموزشی',
    'تجهیزات',
    'محیط زیست',
    'تحلیل',
    'بررسی',
    'راهنما'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'add' 
        ? '/api/admin/articles' 
        : `/api/admin/articles/${initialArticle?.id}`;
      
      const method = mode === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'خطا در ذخیره مقاله');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* عنوان مقاله */}
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            عنوان مقاله <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="عنوان مقاله را وارد کنید"
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          />
        </div>

        {/* دسته‌بندی */}
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            دسته‌بندی <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* زمان مطالعه */}
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            زمان مطالعه <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="readTime"
            value={formData.readTime}
            onChange={handleChange}
            required
            placeholder="مثال: ۵ دقیقه"
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          />
        </div>

        {/* نویسنده */}
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            نویسنده <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          />
        </div>

        {/* تاریخ */}
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            تاریخ
          </label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="مثال: ۱۴۰۳/۰۸/۱۵"
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          />
          <p className="text-gray-500 text-xs mt-1">فرمت: سال/ماه/روز</p>
        </div>

        {/* آدرس تصویر */}
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            آدرس تصویر مقاله
          </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          />
          <p className="text-gray-500 text-xs mt-1">در صورت خالی گذاشتن، جایگزین نمایش داده می‌شود</p>
        </div>

        {/* خلاصه مقاله */}
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            خلاصه مقاله <span className="text-red-500">*</span>
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            rows={3}
            placeholder="خلاصه مقاله را وارد کنید..."
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 resize-none"
          />
        </div>

        {/* متن کامل مقاله */}
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            متن کامل مقاله <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            placeholder="متن کامل مقاله را وارد کنید..."
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 resize-none font-mono text-sm"
          />
          <p className="text-gray-500 text-xs mt-1">از HTML و تگ‌های ساده می‌توانید استفاده کنید</p>
        </div>
      </div>

      {/* دکمه‌ها */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-700">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'در حال ذخیره...' : (mode === 'add' ? 'افزودن مقاله' : 'ذخیره تغییرات')}
        </button>
        <Link
          href="/admin/articles"
          className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          انصراف
        </Link>
      </div>
    </form>
  );
};

export default ArticleForm;