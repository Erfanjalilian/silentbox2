// types/product.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  discountPercent?: number; // اضافه شد (از API)
  rating: number;
  reviewCount: number;
  salesCount?: number; // اضافه شد (از API)
  description: string;
  features: string[];
  imageUrl: string;
  images: string[]; // اضافه شد (آرایه عکس‌ها)
  category: string;
  inStock: boolean;
  isBestSeller: boolean;
  badge: string | null;
}