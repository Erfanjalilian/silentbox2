// app/admin/products/page.tsx
import React, { Suspense } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import AdminProductsClient from '@/app/admin/components/AdminProductsClient';

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

async function getAllProducts(): Promise<Product[]> {
  const { readProducts } = await import('@/lib/data/products');
  return readProducts();
}

function ProductsLoading() {
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
                <div className="h-4 bg-gray-700 rounded w-32"></div>
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

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
              مدیریت محصولات
            </h1>
            <p className="text-gray-400">
              مدیریت و افزودن محصولات فروشگاه
            </p>
          </div>
          <Link
            href="/admin/products/add"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            <PlusIcon className="h-5 w-5" />
            افزودن محصول جدید
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <Suspense fallback={<ProductsLoading />}>
        <AdminProductsClient initialProducts={products} />
      </Suspense>
    </div>
  );
}