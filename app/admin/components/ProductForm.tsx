// app/admin/components/ProductForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  imageUrl: string;
  category: string;
  inStock: boolean;
  isBestSeller: boolean;
  badge: string | null;
}

interface ProductFormProps {
  mode: 'add' | 'edit';
  initialProduct?: Product;
}

// کامپوننت آپلودر تصویر (داخلی)
const ImageUploader: React.FC<{
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onImageRemove?: () => void;
}> = ({ onImageUploaded, currentImage, onImageRemove }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('فرمت فایل باید JPEG، PNG یا WebP باشد');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setPreview(data.url);
        onImageUploaded(data.url);
      } else {
        setError(data.error || 'خطا در آپلود');
      }
    } catch (error) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onImageUploaded('');
    if (onImageRemove) onImageRemove();
  };

  return (
    <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center bg-gray-900/50">
      {error && (
        <div className="mb-3 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-48 mx-auto rounded-lg object-contain"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
          <p className="text-green-400 text-xs mt-2">✓ عکس با موفقیت آپلود شد</p>
        </div>
      ) : (
        <label className="cursor-pointer block">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <PhotoIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            {uploading ? 'در حال آپلود...' : 'برای آپلود عکس کلیک کنید'}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            فرمت‌های مجاز: JPEG, PNG, WebP | حداکثر 5 مگابایت
          </p>
        </label>
      )}
    </div>
  );
};

const ProductForm: React.FC<ProductFormProps> = ({ mode, initialProduct }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [features, setFeatures] = useState<string[]>(
    initialProduct?.features || ['']
  );

  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    price: initialProduct?.price || '',
    originalPrice: initialProduct?.originalPrice || '',
    discount: initialProduct?.discount || '',
    description: initialProduct?.description || '',
    imageUrl: initialProduct?.imageUrl || '',
    category: initialProduct?.category || 'silentbox',
    inStock: initialProduct?.inStock ?? true,
    isBestSeller: initialProduct?.isBestSeller ?? false,
    badge: initialProduct?.badge || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const productData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      discount: Number(formData.discount),
      features: features.filter(f => f.trim() !== ''),
      rating: 0,
      reviewCount: 0,
    };

    try {
      const url = mode === 'add' 
        ? '/api/products' 
        : `/api/products/${initialProduct?.id}`;
      
      const method = mode === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'خطا در ذخیره محصول');
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
        {/* نام محصول */}
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            نام محصول <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          />
        </div>

        {/* دسته‌بندی */}
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            دسته‌بندی
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          >
            <option value="silentbox">سیلنت‌باکس</option>
            <option value="accessory">لوازم جانبی</option>
          </select>
        </div>

        {/* قیمت */}
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            قیمت (تومان) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          />
        </div>

        {/* قیمت اصلی */}
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            قیمت اصلی (تومان)
          </label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          />
        </div>

        {/* تخفیف */}
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            درصد تخفیف
          </label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          />
        </div>

        {/* ✅ بخش آپلود عکس - جایگزین شده */}
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            عکس محصول
          </label>
          <ImageUploader
            onImageUploaded={(url) => {
              setFormData(prev => ({ ...prev, imageUrl: url }));
            }}
            currentImage={formData.imageUrl}
            onImageRemove={() => {
              setFormData(prev => ({ ...prev, imageUrl: '' }));
            }}
          />
          {formData.imageUrl && (
            <p className="text-gray-500 text-xs mt-2">
              لینک فعلی: {formData.imageUrl}
            </p>
          )}
        </div>

        {/* توضیحات */}
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            توضیحات محصول
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 resize-none"
          />
        </div>

        {/* ویژگی‌ها */}
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            ویژگی‌های محصول
          </label>
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder={`ویژگی ${index + 1}`}
                className="flex-1 bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
              />
              {features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  حذف
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 text-sky-400 hover:text-sky-300 text-sm transition-colors"
          >
            + افزودن ویژگی جدید
          </button>
        </div>

        {/* وضعیت */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="w-4 h-4 text-sky-500 focus:ring-sky-500 rounded"
            />
            <span className="text-gray-300 text-sm">موجود در انبار</span>
          </label>
        </div>

        {/* پرفروش */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isBestSeller"
              checked={formData.isBestSeller}
              onChange={handleChange}
              className="w-4 h-4 text-sky-500 focus:ring-sky-500 rounded"
            />
            <span className="text-gray-300 text-sm">محصول پرفروش</span>
          </label>
        </div>

        {/* برچسب */}
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            برچسب (اختیاری)
          </label>
          <input
            type="text"
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            placeholder="مثال: پرفروش‌ترین, ویژه, جدید"
            className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700"
          />
        </div>
      </div>

      {/* دکمه‌ها */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-700">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'در حال ذخیره...' : (mode === 'add' ? 'افزودن محصول' : 'ذخیره تغییرات')}
        </button>
        <Link
          href="/admin/products"
          className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          انصراف
        </Link>
      </div>
    </form>
  );
};

export default ProductForm;