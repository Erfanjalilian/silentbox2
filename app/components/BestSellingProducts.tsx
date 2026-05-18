// components/BestSellingProducts.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PhotoIcon, 
  StarIcon, 
  ShoppingCartIcon,
  FireIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import HorizontalScrollWrapper from '@/app/components/HorizontalScrollWrapper';

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
  salesCount?: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  filters: {
    categories: string[];
    priceRange: { min: number; max: number };
  };
}

async function getBestSellingProducts(): Promise<Product[]> {
  try {
    const { readBestSellingProducts } = await import('@/lib/data/products');
    return readBestSellingProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const hasImage = product.imageUrl && product.imageUrl.trim() !== '';
  const discountPercentage = product.discount;
  
  const renderStars = () => {
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <StarSolidIcon key={`full-${i}`} className="h-3 w-3 text-yellow-500" />
        ))}
        {hasHalfStar && (
          <StarIcon className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className="h-3 w-3 text-gray-600" />
        ))}
      </div>
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  return (
    <div className="w-[280px] sm:w-[300px] flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-sky-500/50 transition-all duration-300 hover:transform hover:scale-105 group h-full flex flex-col relative">
      {/* Best Seller Badge */}
      {product.isBestSeller && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <FireIcon className="h-3 w-3" />
            پرفروش
          </span>
        </div>
      )}
      
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discountPercentage}٪
          </span>
        </div>
      )}
      
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
          {hasImage ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 280px, 300px"
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
        
        {/* Rating - بدون نمایش تعداد نظرات */}
        <div className="mb-2">
          {renderStars()}
        </div>
        
        {/* Price */}
        <div className="mb-2">
          {product.originalPrice > product.price ? (
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-sky-400 text-base font-bold">
                {formatPrice(product.price)}
              </span>
              <span className="text-gray-500 text-xs line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
          ) : (
            <span className="text-sky-400 text-base font-bold">
              {formatPrice(product.price)}
            </span>
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
        
        {/* Add to Cart Button */}
        <button
          disabled={!product.inStock}
          className={`w-full py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-1 mt-auto ${
            product.inStock
              ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCartIcon className="h-4 w-4" />
          {product.inStock ? 'افزودن به سبد' : 'ناموجود'}
        </button>
      </div>
    </div>
  );
}

// Main Best Selling Products Server Component
const BestSellingProducts: React.FC = async () => {
  const products = await getBestSellingProducts();
  
  // مرتب‌سازی بر اساس تعداد فروش واقعی (salesCount) و انتخاب 5 محصول اول
  const bestSellers = products
    .filter(p => p.inStock === true) // فقط محصولات موجود
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 5);

  // دیباگ: در کنسول سرور چاپ کن (برای تست - بعد از تست می‌توانید حذف کنید)
  console.log('=== Top 5 Best Selling Products ===');
  bestSellers.forEach((p, index) => {
    console.log(`${index + 1}. ${p.name} - فروش: ${p.salesCount || 0} - امتیاز: ${p.rating}`);
  });

  if (!bestSellers || bestSellers.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 text-lg">هیچ محصول پرفروشی یافت نشد</p>
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
            <FireIcon className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100">
              پرفروش‌ترین محصولات
            </h2>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto px-4">
            محبوب‌ترین و پرفروش‌ترین محصولات سیلنت‌باکس
          </p>
          <div className="w-16 md:w-20 h-0.5 md:h-1 bg-sky-500 mx-auto mt-3 md:mt-4"></div>
        </div>

        {/* Products Horizontal Scroll */}
        <HorizontalScrollWrapper>
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </HorizontalScrollWrapper>
        
        {/* View All Products Button */}
        <div className="text-center mt-8 md:mt-12">
          <Link
            href="/products"
            className="inline-block bg-transparent border-2 border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white font-semibold px-6 md:px-8 py-2 md:py-3 rounded-lg transition-all duration-300 text-sm md:text-base"
          >
            مشاهده همه محصولات
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellingProducts;