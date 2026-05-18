// app/products/page.tsx
import React, { Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import ProductsClient from '@/app/components/ProductsClient';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  isBestSeller: boolean;
  badge: string | null;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  filters: {
    categories: string[];
    priceRange: { min: number; max: number };
  };
}

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }): Promise<ProductsResponse> {
  const { queryProducts } = await import('@/lib/data/products');
  return queryProducts({
    category:
      typeof searchParams.category === 'string' ? searchParams.category : undefined,
    minPrice:
      typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined,
    maxPrice:
      typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined,
    inStock:
      typeof searchParams.inStock === 'string' ? searchParams.inStock : undefined,
    sortBy:
      typeof searchParams.sortBy === 'string' ? searchParams.sortBy : undefined,
  });
}

// Loading skeleton component
function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-10 bg-gray-800 rounded-lg w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
              <div className="h-48 bg-gray-700"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Error component
function ProductsError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 text-lg mb-4">{message}</p>
        <Link href="/" className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition-all duration-300">
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  try {
    const { products, total, filters } = await getProducts(searchParams);

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Header Spacer */}
        <div className="h-16 md:h-20"></div>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 border-b border-sky-500/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
              همه محصولات
            </h1>
            <p className="text-gray-400">
              {total} محصول یافت شد
            </p>
          </div>
        </div>

        {/* Products Section with Filters */}
        <Suspense fallback={<ProductsLoading />}>
          <ProductsClient 
            initialProducts={products} 
            total={total}
            filters={filters}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    return <ProductsError message="خطا در بارگذاری محصولات" />;
  }
}