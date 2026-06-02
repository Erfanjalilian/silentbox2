import React from 'react';
import Link from 'next/link';
import { TagIcon } from '@heroicons/react/24/outline';

import HorizontalScrollWrapper from '@/app/components/HorizontalScrollWrapperr';
import ProductCard from '@/app/components/ProductCard';

interface Product {
id: string;
name: string;
price: number | null;
originalPrice: number;
discount: number;
discountPercent?: number;
rating: number;
reviewCount: number;
salesCount?: number;
description: string;
features?: string[];
imageUrl: string;
images?: string[];
category: string;
inStock: boolean;
isBestSeller: boolean;
badge: string | null;
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

const getDiscountValue = (product: Product): number => {
return product.discountPercent ?? product.discount ?? 0;
};

const HighestDiscounts = async () => {
const allProducts = await getAllProducts();

const highestDiscounts = [...allProducts]
.filter(
(product) =>
product.inStock &&
getDiscountValue(product) > 0
)
.sort(
(a, b) =>
getDiscountValue(b) - getDiscountValue(a)
)
.slice(0, 8);

// Debug
console.log('=== Highest Discount Products ===');

highestDiscounts.forEach((product, index) => {
console.log(
`${index + 1}. ${product.name} | تخفیف: ${getDiscountValue(
        product
      )}% | قیمت: ${
        product.price
          ? product.price.toLocaleString('fa-IR')
          : 'تماس بگیرید'
      }`
);
});

if (highestDiscounts.length === 0) {
return ( <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800"> <div className="container mx-auto px-4 sm:px-6 lg:px-8"> <div className="text-center"> <p className="text-gray-400 text-lg">
محصول دارای تخفیف یافت نشد </p> </div> </div> </section>
);
}

return ( <section className="py-12 md:py-16 bg-gradient-to-b from-gray-900 to-gray-800"> <div className="container mx-auto px-4 sm:px-6 lg:px-8">

```
    {/* Header */}
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

    {/* Products */}
    <HorizontalScrollWrapper>
      {highestDiscounts.map((product) => (
        <div
          key={product.id}
          className="w-[280px] sm:w-[300px] flex-shrink-0"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </HorizontalScrollWrapper>

    {/* View All */}
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
