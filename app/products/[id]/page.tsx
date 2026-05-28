// app/products/[id]/page.tsx (اصلاح شده نهایی)
'use client';

export const dynamic = 'force-dynamic';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PhotoIcon, StarIcon, ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

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

async function getProduct(id: string): Promise<Product | null> {
  try {
    // استفاده از آدرس نسبی (بدون localhost)
    const response = await fetch(`/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productId = params?.id as string;

  useEffect(() => {
    if (productId) {
      getProduct(productId).then(data => {
        setProduct(data);
        setLoading(false);
        if (!data) {
          setError('Product not found');
        }
      });
    }
  }, [productId]);

  

  const renderStars = () => {
    let rating = product?.rating || 0;
    if (isNaN(rating) || rating < 0) rating = 0;
    if (rating > 5) rating = 5;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <StarSolidIcon key={`full-${i}`} className="h-5 w-5 text-yellow-500" />
        ))}
        {hasHalfStar && (
          <StarIcon className="h-5 w-5 text-yellow-500" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className="h-5 w-5 text-gray-600" />
        ))}
        <span className="text-gray-400 text-sm mr-2">({product?.reviewCount || 0} نظر)</span>
      </div>
    );
  };
  
  const formatPrice = (price: number) => {
    if (!price && price !== 0) return 'تماس بگیرید';
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
          <p className="text-gray-100 mt-4">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  const hasImage = product.imageUrl && product.imageUrl.trim() !== '';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="h-16 md:h-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {showSuccess && (
            <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
              <CheckCircleIcon className="h-5 w-5" />
              <span>محصول به سبد خرید اضافه شد!</span>
            </div>
          )}

          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 mb-6 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            بازگشت به محصولات
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
              {hasImage ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <PhotoIcon className="h-24 w-24 text-sky-500/30 mb-4" />
                  <p className="text-gray-500">تصویر محصول</p>
                </div>
              )}
            </div>
            
            <div>
              <div className="mb-3">
                <span className="inline-block bg-sky-500/10 text-sky-400 text-sm px-3 py-1 rounded-full">
                  {product.category === 'silentbox' ? 'سیلنت‌باکس' : 'لوازم جانبی'}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100 mb-4">
                {product.name}
              </h1>
              
              <div className="mb-4">{renderStars()}</div>
              
              <div className="mb-6">
                {product.originalPrice && product.originalPrice > product.price ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sky-400 text-2xl md:text-3xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-gray-500 text-sm md:text-lg line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-green-500 text-white text-xs md:text-sm px-2 py-1 rounded">
                      {product.discount}٪ تخفیف
                    </span>
                  </div>
                ) : (
                  <span className="text-sky-400 text-2xl md:text-3xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-gray-100 font-semibold mb-3 text-lg">ویژگی‌ها:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="text-gray-400 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>موجود در انبار</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>ناموجود</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <Link
                  href="/payment"
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    product.inStock
                      ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  {product.inStock ? 'اطلاعات پرداخت' : 'ناموجود'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}