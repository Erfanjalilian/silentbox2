// app/products/page.tsx
import React, { Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import ProductsClient from '@/app/components/ProductsClient';

// تایپ کامل محصول با فیلدهای جدید
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  discountPercent?: number; // اضافه شد
  rating: number;
  reviewCount: number;
  salesCount?: number; // اضافه شد
  description: string;
  features?: string[]; // اضافه شد
  imageUrl: string;
  images?: string[]; // اضافه شد (آرایه عکس‌ها)
  category: string;
  inStock: boolean;
  isBestSeller: boolean;
  badge: string | null;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  filters: {
    categories: string[];
    priceRange: { min: number; max: number };
  };
}

// Props برای ProductsPage
interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

// تابع دریافت محصولات از API
async function getProducts(searchParams: { [key: string]: string | string[] | undefined }): Promise<ProductsResponse> {
  try {
    // ساخت query string
    const params = new URLSearchParams();
    params.append('getAll', 'true');
    
    if (searchParams.category && searchParams.category !== 'all') {
      params.append('category', searchParams.category as string);
    }
    if (searchParams.minPrice) {
      params.append('minPrice', searchParams.minPrice as string);
    }
    if (searchParams.maxPrice) {
      params.append('maxPrice', searchParams.maxPrice as string);
    }
    if (searchParams.inStock) {
      params.append('inStock', searchParams.inStock as string);
    }
    if (searchParams.sortBy) {
      params.append('sortBy', searchParams.sortBy as string);
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products?${params.toString()}`, {
      cache: 'no-store',
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    
    // اگر response مستقیم products باشه (برای getAll=true)
    if (Array.isArray(data)) {
      return {
        products: data.map(p => ({
          ...p,
          discountPercent: p.discountPercent ?? p.discount ?? 0,
          salesCount: p.salesCount ?? 0,
          images: p.images ?? (p.imageUrl ? [p.imageUrl] : [])
        })),
        total: data.length,
        filters: {
          categories: ['all', 'silentbox', 'accessory'],
          priceRange: { min: 0, max: 50000000 }
        }
      };
    }
    
    // اگر response با ساختار { products, total, filters } باشه
    return {
      products: data.products?.map((p: any) => ({
        ...p,
        discountPercent: p.discountPercent ?? p.discount ?? 0,
        salesCount: p.salesCount ?? 0,
        images: p.images ?? (p.imageUrl ? [p.imageUrl] : [])
      })) || [],
      total: data.total || 0,
      filters: data.filters || {
        categories: ['all', 'silentbox', 'accessory'],
        priceRange: { min: 0, max: 50000000 }
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      total: 0,
      filters: {
        categories: ['all', 'silentbox', 'accessory'],
        priceRange: { min: 0, max: 50000000 }
      }
    };
  }
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

// صفحه اصلی محصولات (Server Component)
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  try {
    // حل کردن searchParams (برای Next.js 15)
    const params = await searchParams;
    
    const { products, total, filters } = await getProducts(params);

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
    console.error('Error in ProductsPage:', error);
    return <ProductsError message="خطا در بارگذاری محصولات" />;
  }
}