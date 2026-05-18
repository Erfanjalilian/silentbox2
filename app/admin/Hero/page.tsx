// app/admin/hero/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';

interface HeroData {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const HeroAdminPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  
  const [formData, setFormData] = useState<HeroData>({
    imageUrl: '',
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: ''
  });

  // دریافت دیتای فعلی هیرو
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/hero');
        
        if (!response.ok) {
          throw new Error('Failed to fetch hero data');
        }
        
        const data = await response.json();
        setFormData({
          imageUrl: data.imageUrl || '',
          title: data.title || '',
          subtitle: data.subtitle || '',
          buttonText: data.buttonText || '',
          buttonLink: data.buttonLink || ''
        });
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

  // آپلود عکس
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // بررسی نوع فایل
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('فرمت فایل باید JPEG، PNG یا WebP باشد');
      return;
    }

    // بررسی حجم فایل (حداکثر 5 مگابایت)
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    setUploading(true);
    setError(null);

    const uploadFormData = new FormData();
    uploadFormData.append('action', 'upload');
    uploadFormData.append('image', file);

    try {
      const response = await fetch('/api/hero', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
        setImageError(false);
        setSuccess('عکس با موفقیت آپلود شد');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'خطا در آپلود عکس');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  // حذف عکس
  const handleRemoveImage = async () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setImageError(false);
    setSuccess('عکس با موفقیت حذف شد');
    setTimeout(() => setSuccess(null), 3000);
  };

  // تغییر متن
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ذخیره دیتا
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('اطلاعات با موفقیت ذخیره شد');
        setTimeout(() => setSuccess(null), 3000);
        router.refresh();
      } else {
        setError(data.error || 'خطا در ذخیره اطلاعات');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
          <p className="text-gray-100 mt-4">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
            مدیریت بخش Hero
          </h1>
          <p className="text-gray-400">
            تنظیمات بنر اصلی صفحه اصلی
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              تصویر بنر
            </label>
            
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center bg-gray-900/50">
              {formData.imageUrl && !imageError ? (
                <div className="relative">
                  <div className="relative h-48 md:h-64 w-full rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={formData.imageUrl}
                      alt="Hero Banner"
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5 text-white" />
                  </button>
                  <p className="text-green-400 text-sm mt-2">✓ عکس با موفقیت آپلود شد</p>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <PhotoIcon className="w-16 h-16 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">
                    {uploading ? 'در حال آپلود...' : 'برای آپلود عکس کلیک کنید'}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    فرمت‌های مجاز: JPEG, PNG, WebP | حداکثر 5 مگابایت
                  </p>
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              عنوان اصلی <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
              placeholder="مثال: به دنیای سایلنت باکس خوش آمدید"
            />
          </div>

          {/* Subtitle */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              زیرعنوان
            </label>
            <textarea
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 resize-none"
              placeholder="مثال: با کیفیت‌ترین سایلنت‌باکس‌ها و لوازم جانبی ماینینگ"
            />
          </div>

          {/* Button Text */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              متن دکمه <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="buttonText"
              value={formData.buttonText}
              onChange={handleChange}
              required
              className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
              placeholder="مثال: مشاهده محصولات"
            />
          </div>

          {/* Button Link */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              لینک دکمه <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="buttonLink"
              value={formData.buttonLink}
              onChange={handleChange}
              required
              className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
              placeholder="مثال: /products"
            />
            <p className="text-gray-500 text-xs mt-1">
              لینک داخلی مانند /products یا لینک خارجی مانند https://example.com
            </p>
          </div>

          {/* Preview Section */}
          <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <h3 className="text-gray-100 font-semibold mb-3">پیش‌نمایش:</h3>
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gradient-to-r from-gray-800 to-gray-700">
              {formData.imageUrl && !imageError && (
                <Image
                  src={formData.imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover opacity-50"
                />
              )}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
                <h2 className="text-white text-lg font-bold mb-1">
                  {formData.title || 'عنوان اصلی'}
                </h2>
                <p className="text-gray-200 text-sm mb-2">
                  {formData.subtitle || 'زیرعنوان'}
                </p>
                <button className="bg-green-500 text-white text-sm px-4 py-1.5 rounded-lg">
                  {formData.buttonText || 'مشاهده محصولات'}
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              بازگشت
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroAdminPage;