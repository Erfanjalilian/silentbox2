// app/products/[id]/page.tsx
'use client';

export const dynamic = 'force-dynamic';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PhotoIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

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
  salesCount?: number;
  description: string;
  features: string[];
  imageUrl: string;
  images?: string[];
  category: string;
  inStock: boolean;
  isBestSeller: boolean;
  badge: string | null;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
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
    
    const product = await response.json();
    
    // نرمالایز کردن محصول
    return {
      ...product,
      discountPercent: product.discountPercent ?? product.discount ?? 0,
      salesCount: product.salesCount ?? 0,
      images: product.images ?? (product.imageUrl ? [product.imageUrl] : [])
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// کامپوننت گالری عکس
function ImageGallery({ product }: { product: Product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // گرفتن همه عکس‌ها
  const getAllImages = (): string[] => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return product.imageUrl ? [product.imageUrl] : [];
  };
  
  const images = getAllImages();
  const hasMultipleImages = images.length > 1;
  
  // رفتن به عکس بعدی
  const nextImage = () => {
    if (hasMultipleImages) {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    }
  };
  
  // رفتن به عکس قبلی
  const prevImage = () => {
    if (hasMultipleImages) {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };
  
  // انتخاب عکس از thumbnail
  const selectImage = (index: number) => {
    setSelectedImageIndex(index);
  };
  
  const currentImage = images[selectedImageIndex] || '';
  const hasImage = currentImage !== '';
  
  return (
    <div className="space-y-4">
      {/* Main Image with Navigation Arrows */}
      <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 group">
        {hasImage ? (
          <>
            <Image
              src={currentImage}
              alt={`${product.name} - تصویر ${selectedImageIndex + 1}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Navigation Arrows (only if multiple images) */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="عکس قبلی"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="عکس بعدی"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <PhotoIcon className="h-24 w-24 text-sky-500/30 mb-4" />
            <p className="text-gray-500">تصویر محصول</p>
          </div>
        )}
      </div>
      
      {/* Thumbnails (only if multiple images) */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                selectedImageIndex === index
                  ? 'ring-2 ring-sky-500 ring-offset-2 ring-offset-gray-800'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`تصویر کوچک ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
  
  const getDiscountPercent = (): number => {
    return product?.discountPercent || product?.discount || 0;
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

  const discountPercent = getDiscountPercent();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="h-16 md:h-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
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
            {/* Image Gallery Section */}
            <ImageGallery product={product} />
            
            {/* Product Info Section */}
            <div>
              {/* Badges */}
              <div className="mb-3 flex gap-2 flex-wrap">
                <span className="inline-block bg-sky-500/10 text-sky-400 text-sm px-3 py-1 rounded-full">
                  {product.category === 'silentbox' ? 'سیلنت‌باکس' : 'لوازم جانبی'}
                </span>
                {product.isBestSeller && (
                  <span className="inline-block bg-orange-500/10 text-orange-400 text-sm px-3 py-1 rounded-full">
                    پرفروش
                  </span>
                )}
                {product.badge && (
                  <span className="inline-block bg-purple-500/10 text-purple-400 text-sm px-3 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100 mb-4">
                {product.name}
              </h1>
              
              <div className="mb-4">{renderStars()}</div>
              
              {/* Sales Count */}
              {product.salesCount && product.salesCount > 0 && (
                <div className="mb-4">
                  <span className="text-gray-400 text-sm">
                    🏆 {product.salesCount.toLocaleString('fa-IR')} فروش موفق
                  </span>
                </div>
              )}
              
              {/* Price Section */}
              <div className="mb-6">
                {hasDiscount ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sky-400 text-2xl md:text-3xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-gray-500 text-sm md:text-lg line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-green-500 text-white text-xs md:text-sm px-2 py-1 rounded">
                      {discountPercent}٪ تخفیف
                    </span>
                  </div>
                ) : (
                  <span className="text-sky-400 text-2xl md:text-3xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              {/* Features */}
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
              
              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>موجود در انبار</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>ناموجود</span>
                  </div>
                )}
              </div>

              {/* Payment Button */}
              <div className="mb-6">
                <Link
                  href="/payment"
                  className="w-full inline-flex py-3 rounded-lg font-semibold transition-all duration-300 items-center justify-center gap-2 bg-slate-800 text-slate-100 hover:bg-slate-700"
                >
                  مشاهده اطلاعات پرداخت
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}