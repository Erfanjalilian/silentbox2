// app/components/ProductsClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number | null; // ✅ اضافه کردن null به type
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

interface ProductsClientProps {
  initialProducts: Product[];
  total: number;
  filters: {
    categories: string[];
    priceRange: { min: number; max: number };
  };
}

const ProductsClient: React.FC<ProductsClientProps> = ({ initialProducts, total, filters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  
  const [currentFilters, setCurrentFilters] = useState({
    category: searchParams.get('category') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') || '',
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  const categoryNames: Record<string, string> = {
    all: 'همه محصولات',
    silentbox: 'سیلنت‌باکس',
    accessory: 'لوازم جانبی'
  };

  const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'price_asc', label: 'ارزان‌ترین' },
    { value: 'price_desc', label: 'گران‌ترین' },
    { value: 'discount_desc', label: 'بیشترین تخفیف' },
    { value: 'rating_desc', label: 'بالاترین امتیاز' }
  ];

  // ✅ اصلاح شده: تابع formatPrice با اعتبارسنجی کامل
  const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined || isNaN(price)) {
      return 'تماس بگیرید';
    }
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.set('getAll', 'true');
      
      if (currentFilters.category && currentFilters.category !== 'all') {
        params.set('category', currentFilters.category);
      }
      if (currentFilters.minPrice) params.set('minPrice', currentFilters.minPrice);
      if (currentFilters.maxPrice) params.set('maxPrice', currentFilters.maxPrice);
      if (currentFilters.inStock) params.set('inStock', currentFilters.inStock);
      if (currentFilters.sortBy && currentFilters.sortBy !== 'newest') {
        params.set('sortBy', currentFilters.sortBy);
      }

      try {
        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();
        // ✅ اطمینان از اینکه products همیشه آرایه است
        const fetchedProducts = data.products || data || [];
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentFilters]);

  const updateFilters = (newFilters: Partial<typeof currentFilters>) => {
    const updatedFilters = { ...currentFilters, ...newFilters };
    setCurrentFilters(updatedFilters);

    // Update URL
    const params = new URLSearchParams();
    if (updatedFilters.category && updatedFilters.category !== 'all') params.set('category', updatedFilters.category);
    if (updatedFilters.minPrice) params.set('minPrice', updatedFilters.minPrice);
    if (updatedFilters.maxPrice) params.set('maxPrice', updatedFilters.maxPrice);
    if (updatedFilters.inStock) params.set('inStock', updatedFilters.inStock);
    if (updatedFilters.sortBy && updatedFilters.sortBy !== 'newest') params.set('sortBy', updatedFilters.sortBy);

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const clearFilters = () => {
    setCurrentFilters({
      category: 'all',
      minPrice: '',
      maxPrice: '',
      inStock: '',
      sortBy: 'newest'
    });
    router.push('/products', { scroll: false });
  };

  const hasActiveFilters = () => {
    return currentFilters.category !== 'all' || 
           currentFilters.minPrice || 
           currentFilters.maxPrice || 
           currentFilters.inStock || 
           currentFilters.sortBy !== 'newest';
  };

  const displayProducts = products;
  const displayTotal = products?.length || 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-100 font-bold text-lg">فیلترها</h3>
              {hasActiveFilters() && (
                <button onClick={clearFilters} className="text-sky-400 text-sm hover:underline">
                  حذف همه
                </button>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-gray-100 text-sm font-semibold mb-3">دسته‌بندی</label>
              <div className="space-y-2">
                {filters.categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={currentFilters.category === cat}
                      onChange={(e) => updateFilters({ category: e.target.value })}
                      className="w-4 h-4 text-sky-500 focus:ring-sky-500"
                    />
                    <span className="text-gray-400 text-sm">{categoryNames[cat] || cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-gray-100 text-sm font-semibold mb-3">محدوده قیمت (تومان)</label>
              <div className="space-y-3">
                <input
                  type="number"
                  value={currentFilters.minPrice}
                  onChange={(e) => updateFilters({ minPrice: e.target.value })}
                  placeholder={`حداقل ${formatPrice(filters.priceRange.min)}`}
                  className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 text-sm placeholder-gray-500"
                />
                <input
                  type="number"
                  value={currentFilters.maxPrice}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                  placeholder={`حداکثر ${formatPrice(filters.priceRange.max)}`}
                  className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 text-sm placeholder-gray-500"
                />
              </div>
            </div>

            {/* In Stock */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentFilters.inStock === 'true'}
                  onChange={(e) => updateFilters({ inStock: e.target.checked ? 'true' : '' })}
                  className="w-4 h-4 text-sky-500 focus:ring-sky-500 rounded"
                />
                <span className="text-gray-400 text-sm">فقط محصولات موجود</span>
              </label>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-gray-100 text-sm font-semibold mb-3">مرتب‌سازی</label>
              <select
                value={currentFilters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <FunnelIcon className="h-5 w-5" />
            فیلترها
            {hasActiveFilters() && (
              <span className="bg-sky-500 text-white text-xs px-2 py-0.5 rounded-full">
                فعال
              </span>
            )}
          </button>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
            <p className="text-gray-400 text-sm">
              {displayTotal} محصول
            </p>
            <div className="lg:hidden">
              <select
                value={currentFilters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="bg-gray-800 text-gray-100 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">محصولی یافت نشد</p>
              <button onClick={clearFilters} className="mt-4 text-sky-400 hover:underline">
                حذف فیلترها
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/95" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-gray-800 shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800">
              <h3 className="text-gray-100 text-lg font-bold">فیلترها</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-400 hover:text-gray-100">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              {/* Category */}
              <div className="mb-6">
                <label className="block text-gray-100 text-sm font-semibold mb-3">دسته‌بندی</label>
                <div className="space-y-2">
                  {filters.categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="category-mobile"
                        value={cat}
                        checked={currentFilters.category === cat}
                        onChange={(e) => {
                          updateFilters({ category: e.target.value });
                          setIsMobileFilterOpen(false);
                        }}
                        className="w-4 h-4 text-sky-500 focus:ring-sky-500"
                      />
                      <span className="text-gray-400 text-sm">{categoryNames[cat] || cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-gray-100 text-sm font-semibold mb-3">محدوده قیمت (تومان)</label>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={currentFilters.minPrice}
                    onChange={(e) => updateFilters({ minPrice: e.target.value })}
                    placeholder={`حداقل ${formatPrice(filters.priceRange.min)}`}
                    className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 text-sm placeholder-gray-500"
                  />
                  <input
                    type="number"
                    value={currentFilters.maxPrice}
                    onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                    placeholder={`حداکثر ${formatPrice(filters.priceRange.max)}`}
                    className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 text-sm placeholder-gray-500"
                  />
                </div>
              </div>

              {/* In Stock */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentFilters.inStock === 'true'}
                    onChange={(e) => updateFilters({ inStock: e.target.checked ? 'true' : '' })}
                    className="w-4 h-4 text-sky-500 focus:ring-sky-500 rounded"
                  />
                  <span className="text-gray-400 text-sm">فقط محصولات موجود</span>
                </label>
              </div>

              {/* Sort By on Mobile */}
              <div className="mb-6">
                <label className="block text-gray-100 text-sm font-semibold mb-3">مرتب‌سازی</label>
                <select
                  value={currentFilters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    clearFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="flex-1 bg-gray-700 text-gray-100 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                >
                  حذف همه
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg text-sm transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsClient;