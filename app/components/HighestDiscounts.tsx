// components/HighestDiscounts.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PhotoIcon, 
  StarIcon, 
  ShoppingCartIcon,
  TagIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import HorizontalScrollWrapper from '@/app/components/HorizontalScrollWrapperr';

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

async function getAllProducts(): Promise<Product[]> {
  try {
    const { readProducts } = await import('@/lib/data/products');
    return readProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Product Card Component (نسخه کوچک‌تر برای موبایل)
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
        {/* reviewCount حذف شد */}
      </div>
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const savingAmount = product.originalPrice - product.price;
  const savingInThousands = Math.round(savingAmount / 1000);

  return (
    <div className="w-[280px] sm:w-[300px] flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-sky-500/50 transition-all duration-300 hover:transform hover:scale-105 group h-full flex flex-col relative">
      {/* Discount Badge - Prominent for highest discounts */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <TagIcon className="h-3 w-3" />
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
        
        {/* Rating */}
        <div className="mb-2">
          {renderStars()}
        </div>
        
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
          {savingAmount > 0 && (
            <div className="flex items-center gap-1 mt-1">
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

// Main Highest Discounts Server Component
const HighestDiscounts: React.FC = async () => {
  const allProducts = await getAllProducts();
  
  const highestDiscounts = [...allProducts]
    .filter(product => product.discount > 0 && product.inStock)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 8); // افزایش به 8 محصول برای اسکرول بهتر

  // دیباگ
  console.log('=== Highest Discount Products ===');
  highestDiscounts.forEach((p, index) => {
    console.log(`${index + 1}. ${p.name} - تخفیف: ${p.discount}% - قیمت: ${p.price.toLocaleString()}`);
  });

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

        {/* Products Horizontal Scroll - استفاده از کامپوننت کلاینت مجزا */}
        <HorizontalScrollWrapper>
          {highestDiscounts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </HorizontalScrollWrapper>
        
        {/* View All Discounts Button */}
        <div className="text-center mt-8 md:mt-12">
          <Link
            href="/products?discount=true"
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