// app/admin/components/ImageUploader.tsx
'use client';

import { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onImageRemove?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  currentImage, 
  onImageRemove 
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // بررسی نوع فایل
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('فرمت فایل باید JPEG، PNG یا WebP باشد');
      return;
    }

    // بررسی حجم
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
      console.error('Upload failed:', error);
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

export default ImageUploader;