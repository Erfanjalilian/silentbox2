// app/admin/products/add/page.tsx
import React from 'react';
import Link from 'next/link';
import ProductForm from '@/app/admin/components/ProductForm';

export default function AddProductPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Link
            href="/admin/products"
            className="text-sky-400 hover:text-sky-300 transition-colors"
          >
            ← بازگشت
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
            افزودن محصول جدید
          </h1>
        </div>
        <p className="text-gray-400">
          اطلاعات محصول جدید را وارد کنید
        </p>
      </div>

      {/* Form */}
      <ProductForm mode="add" />
    </div>
  );
}