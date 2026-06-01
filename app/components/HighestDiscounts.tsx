// components/HighestDiscounts.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PhotoIcon, 
  StarIcon, 
  ShoppingCartIcon,
  TagIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import HorizontalScrollWrapper from '@/app/components/HorizontalScrollWrapper';

// تایپ کامل محصول با فیلدهای جدید
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  imageUrl: string;
  images?: string[];
  category: string;
  inStock: boolean;
  isBestSeller: boolean;
  badge: string | null;
  salesCount?: number;
}

// Product Card Component (Client Component)
function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  
  // گرفتن عکس اصلی (با اولویت images)
  const getMainImage = (): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.imageUrl || '';
  };
  
  const hasImage = getMainImage() !== '' && !imageError;
  
  // گرفتن درصد تخفیف (از discountPercent یا discount)
  const getDiscountPercentage = (): number => {
    const discount = product.discountPercent || product.discount || 0;
    return discount > 0 ? discount : 0;
  };
  
  const discountPercentage = getDiscountPercentage();
  
  const renderStars = () => {
    let rating = product.rating;
    
    if (rating === null || rating === undefined || isNaN(rating)) {
      rating = 0;
    }
    if (rating < 0) rating = 0;
    if (rating > 5) rating = 5;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <StarSolidIcon key={`full-${i}`} className="h-3 w-3 text-yellow-500" />
        ))}
        {hasHalfStar && (
          <StarIcon className="h-3 w-3 text-yellow-500" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className="h-3 w-3 text-gray-600" />
        ))}
        {product.reviewCount > 0 && (
          <span className="text-gray-500 text-xs mr-1">({product.reviewCount})</span>
        )}
      </div>
    );
  };

  const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined || isNaN(price) || price === 0) {
      return 'تماس بگیرید';
    }
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const savingAmount = product.originalPrice - product.price;
  const savingInThousands = Math.round(savingAmount / 1000);
  const hasValidDiscount = discountPercentage > 0 && savingAmount > 0;

  return (
    <div className="w-[280px] sm:w-[300px] flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-sky-500/50 transition-all duration-300 hover:transform hover:scale-105 group h-full flex flex-col relative">
      {/* Discount Badge - Prominent for highest discounts */}
      {hasValidDiscount && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <TagIcon className="h-3 w-3" />
            {discountPercentage}٪
          </span>
        </div>
      )}
      
      {/* Best Seller Badge (اختیاری) */}
      {product.isBestSeller && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            پرفروش
          </span>
        </div>
      )}
      
      {/* Custom Badge */}
      {product.badge && !product.isBestSeller && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {product.badge}
          </span>
        </div>
      )}
      
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
          {hasImage ? (
            <Image
              src={getMainImage()}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 280px, 300px"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <PhotoIcon className="h-12 w-12 text-sky-500/30 mb-2" />
              <p className="text-gray-500 text-xs">تصویر محصول</p>
            </div>
          )}
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-3 flex-grow flex flex-col">
        {/* Category */}
        <p className="text-sky-400 text-xs mb-1">
          {product.category === 'silentbox' ? 'سیلنت‌باکس' : 'لوازم جانبی'}
        </p>
        
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-bold text-gray-100 mb-1 hover:text-sky-400 transition-colors line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="mb-2">
          {renderStars()}
        </div>
        
        {/* Sales Count (اختیاری) */}
        {product.salesCount && product.salesCount > 0 && (
          <div className="mb-1">
            <span className="text-gray-500 text-xs">
              🏆 {product.salesCount.toLocaleString('fa-IR')} فروش
            </span>
          </div>
        )}
        
        {/* Price with prominent discount display */}
        <div className="mb-2">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-sky-400 text-base font-bold">
              {formatPrice(product.price)}
            </span>
            <span className="text-gray-500 text-xs line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>
          {hasValidDiscount && (
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              <span className="bg-green-500/20 text-green-400 text-xs px-1.5 py-0.5 rounded-full">
                {discountPercentage}٪ تخفیف
              </span>
              <span className="text-green-500 text-xs">
                {savingInThousands.toLocaleString('fa-IR')} هزار تومان صرفه‌جویی
              </span>
            </div>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="mb-2">
          {product.inStock ? (
            <span className="text-green-500 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              موجود
            </span>
          ) : (
            <span className="text-red-500 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              ناموجود
            </span>
          )}
        </div>
        
        {/* View Product Button */}
        <Link
          href={`/products/${product.id}`}
          className={`w-full py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-1 mt-auto ${
            product.inStock
              ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none'
          }`}
        >
          <ShoppingCartIcon className="h-4 w-4" />
          {product.inStock ? 'مشاهده محصول' : 'ناموجود'}
        </Link>
      </div>
    </div>
  );
}

// تابع دریافت محصولات از API
async function getAllProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    // رفع هشدار: حذف cache: 'no-store' و فقط استفاده از next.revalidate
    const response = await fetch(`${baseUrl}/api/products?getAll=true`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    
    let products: Product[] = [];
    
    if (Array.isArray(data)) {
      products = data;
    } else if (data.products && Array.isArray(data.products)) {
      products = data.products;
    } else {
      products = [];
    }
    
    return products.map(p => ({
      ...p,
      discountPercent: p.discountPercent ?? p.discount ?? 0,
      salesCount: p.salesCount ?? 0,
      images: p.images ?? (p.imageUrl ? [p.imageUrl] : [])
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Main Highest Discounts Component (Client Component با useEffect)
const HighestDiscounts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getAllProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);
  
  // مرتب‌سازی بر اساس درصد تخفیف واقعی (discountPercent یا discount)
  const highestDiscounts = [...products]
    .filter(product => {
      const discountPercent = product.discountPercent || product.discount || 0;
      return discountPercent > 0 && product.inStock;
    })
    .sort((a, b) => {
      const discountA = a.discountPercent || a.discount || 0;
      const discountB = b.discountPercent || b.discount || 0;
      return discountB - discountA;
    })
    .slice(0, 8); // نمایش 8 محصول با بیشترین تخفیف

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-2">در حال بارگذاری...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!highestDiscounts || highestDiscounts.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 text-lg">محصول با تخفیفی یافت نشد</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
            <TagIcon className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100">
              ویژه‌ترین تخفیف‌ها
            </h2>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto px-4">
            بهترین محصولات با بالاترین درصد تخفیف را از دست ندهید
          </p>
          <div className="w-16 md:w-20 h-0.5 md:h-1 bg-sky-500 mx-auto mt-3 md:mt-4"></div>
        </div>

        {/* Products Horizontal Scroll */}
        <HorizontalScrollWrapper>
          {highestDiscounts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </HorizontalScrollWrapper>
        
        {/* View All Discounts Button */}
        <div className="text-center mt-8 md:mt-12">
          <Link
            href="/products?sortBy=discount_desc"
            className="inline-block bg-transparent border-2 border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white font-semibold px-6 md:px-8 py-2 md:py-3 rounded-lg transition-all duration-300 text-sm md:text-base"
          >
            مشاهده همه تخفیف‌ها
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HighestDiscounts;