// app/components/ProductCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PhotoIcon, StarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  price: number | null;
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

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const hasImage = product.imageUrl && product.imageUrl.trim() !== '';
  
  const discountPercentage = product.discount && !isNaN(product.discount) && product.discount > 0 
    ? product.discount 
    : 0;

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
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <StarSolidIcon key={`full-${i}`} className="h-3 md:h-4 w-3 md:w-4 text-yellow-500" />
        ))}
        {hasHalfStar && (
          <StarIcon className="h-3 md:h-4 w-3 md:w-4 text-yellow-500" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className="h-3 md:h-4 w-3 md:w-4 text-gray-600" />
        ))}
        {/* reviewCount حذف شد - نمایش تعداد نظرات وجود ندارد */}
      </div>
    );
  };

  const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined || isNaN(price)) {
      return 'تماس بگیرید';
    }
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const hasDiscount = () => {
    const price = product.price;
    const originalPrice = product.originalPrice;
    
    if (price === null || price === undefined || isNaN(price)) return false;
    if (originalPrice === null || originalPrice === undefined || isNaN(originalPrice)) return false;
    
    return originalPrice > price;
  };

  const getValidPrice = (): number => {
    if (product.price === null || product.price === undefined || isNaN(product.price)) {
      return 0;
    }
    return product.price;
  };

  const getValidOriginalPrice = (): number => {
    if (product.originalPrice === null || product.originalPrice === undefined || isNaN(product.originalPrice)) {
      return 0;
    }
    return product.originalPrice;
  };

  const validPrice = getValidPrice();
  const validOriginalPrice = getValidOriginalPrice();
  const showDiscount = hasDiscount();

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-sky-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/10 group h-full flex flex-col relative">
      
      {/* Badges - مشترک برای موبایل و دسکتاپ */}
      {product.badge && product.badge.trim() !== '' && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.badge}
          </span>
        </div>
      )}

      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discountPercentage}٪
          </span>
        </div>
      )}

      {/* ========== موبایل: Layout افقی ========== */}
      <div className="block md:hidden">
        <div className="flex flex-row">
          
          {/* سمت راست: عکس (یک سوم عرض) */}
          <Link href={`/products/${product.id}`} className="block w-1/3">
            <div className="relative h-full min-h-[160px] bg-gradient-to-br from-gray-700 to-gray-800">
              {hasImage ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name || 'محصول'}
                  fill
                  className="object-cover"
                  sizes="33vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'flex flex-col items-center justify-center h-full';
                      fallback.innerHTML = `
                        <svg class="h-8 w-8 text-sky-500/30 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="text-gray-500 text-xs">تصویر</p>
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <PhotoIcon className="h-8 w-8 text-sky-500/30 mb-1" />
                  <p className="text-gray-500 text-xs">تصویر</p>
                </div>
              )}
            </div>
          </Link>

          {/* سمت چپ: اطلاعات (دو سوم عرض) */}
          <div className="w-2/3 p-3 flex flex-col">
            <p className="text-sky-400 text-xs mb-1">
              {product.category === 'silentbox' ? 'سیلنت‌باکس' : 'لوازم جانبی'}
            </p>

            <Link href={`/products/${product.id}`}>
              <h3 className="text-sm font-bold text-gray-100 mb-1 hover:text-sky-400 transition-colors line-clamp-2">
                {product.name || 'بدون نام'}
              </h3>
            </Link>

            <div className="mb-1">
              {renderStars()}
            </div>

            <div className="mb-1">
              {showDiscount && validOriginalPrice > validPrice ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sky-400 text-base font-bold">
                    {formatPrice(validPrice)}
                  </span>
                  <span className="text-gray-500 text-xs line-through">
                    {formatPrice(validOriginalPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-sky-400 text-base font-bold">
                  {formatPrice(validPrice)}
                </span>
              )}
            </div>

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

            {/* دکمه افزودن به سبد - تغییر به Link برای رفتن به صفحه جزئیات */}
            <Link 
              href={`/products/${product.id}`}
              className={`w-full py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1 ${
                product.inStock
                  ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none'
              }`}
            >
              <ShoppingCartIcon className="h-3.5 w-3.5" />
              {product.inStock ? 'مشاهده محصول' : 'ناموجود'}
            </Link>
          </div>
        </div>
      </div>

      {/* ========== دسکتاپ: Layout عمودی ========== */}
      <div className="hidden md:block">
        {/* Product Image */}
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
            {hasImage ? (
              <Image
                src={product.imageUrl}
                alt={product.name || 'محصول'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'flex flex-col items-center justify-center h-full';
                    fallback.innerHTML = `
                      <svg class="h-12 w-12 text-sky-500/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="text-gray-500 text-xs">تصویر محصول</p>
                    `;
                    parent.appendChild(fallback);
                  }
                }}
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
        <div className="p-4 flex-grow flex flex-col">
          <p className="text-sky-400 text-xs mb-1">
            {product.category === 'silentbox' ? 'سیلنت‌باکس' : 'لوازم جانبی'}
          </p>

          <Link href={`/products/${product.id}`}>
            <h3 className="text-base font-bold text-gray-100 mb-2 hover:text-sky-400 transition-colors line-clamp-2 min-h-[50px]">
              {product.name || 'بدون نام'}
            </h3>
          </Link>

          <div className="mb-2">
            {renderStars()}
          </div>

          <div className="mb-3">
            {showDiscount && validOriginalPrice > validPrice ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sky-400 text-lg font-bold">
                  {formatPrice(validPrice)}
                </span>
                <span className="text-gray-500 text-xs line-through">
                  {formatPrice(validOriginalPrice)}
                </span>
              </div>
            ) : (
              <span className="text-sky-400 text-lg font-bold">
                {formatPrice(validPrice)}
              </span>
            )}
          </div>

          <div className="mb-3">
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

          {/* دکمه افزودن به سبد - تغییر به Link برای رفتن به صفحه جزئیات */}
          <Link
            href={`/products/${product.id}`}
            className={`w-full py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
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
    </div>
  );
};

export default ProductCard;