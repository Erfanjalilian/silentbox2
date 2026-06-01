// lib/data/products.ts
import fs from "fs";
import path from "path";

const productsFilePath = path.join(process.cwd(), "products.json");

export interface ProductRecord {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  discountPercent: number; // اضافه شد
  rating: number;
  reviewCount: number;
  salesCount: number; // اضافه شد
  description: string;
  features: string[];
  imageUrl: string;
  images: string[]; // اضافه شد
  category: string;
  inStock: boolean;
  isBestSeller: boolean;
  badge: string | null;
}

export interface ProductListQuery {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sortBy?: string;
}

export interface ProductsListResult {
  products: ProductRecord[];
  total: number;
  filters: {
    categories: string[];
    priceRange: { min: number; max: number };
  };
}

// تابع برای نرمالایز کردن محصولات (اطمینان از وجود فیلدهای جدید)
function normalizeProduct(product: any): ProductRecord {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    discountPercent: product.discountPercent ?? product.discount ?? 0,
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    salesCount: product.salesCount ?? 0,
    description: product.description ?? "",
    features: product.features ?? [],
    imageUrl: product.imageUrl ?? "",
    images: product.images ?? (product.imageUrl ? [product.imageUrl] : []),
    category: product.category,
    inStock: product.inStock ?? true,
    isBestSeller: product.isBestSeller ?? false,
    badge: product.badge ?? null,
  };
}

export function readProducts(): ProductRecord[] {
  try {
    if (!fs.existsSync(productsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(productsFilePath, "utf8");
    const products = JSON.parse(data);
    
    // نرمالایز کردن همه محصولات
    return products.map(normalizeProduct);
  } catch (error) {
    console.error("[data/products] read error:", error);
    return [];
  }
}

export function getProductById(id: string): ProductRecord | null {
  const product = readProducts().find((p) => p.id === id);
  return product ?? null;
}

export function queryProducts(
  searchParams: ProductListQuery,
): ProductsListResult {
  const productsData = readProducts();
  let filteredProducts = [...productsData];

  // فیلتر بر اساس دسته‌بندی
  if (searchParams.category && searchParams.category !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === searchParams.category,
    );
  }

  // فیلتر بر اساس حداقل قیمت
  if (searchParams.minPrice) {
    const minPrice = parseInt(searchParams.minPrice, 10);
    if (!isNaN(minPrice)) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= minPrice,
      );
    }
  }

  // فیلتر بر اساس حداکثر قیمت
  if (searchParams.maxPrice) {
    const maxPrice = parseInt(searchParams.maxPrice, 10);
    if (!isNaN(maxPrice)) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= maxPrice,
      );
    }
  }

  // فیلتر بر اساس موجودی
  if (searchParams.inStock === "true") {
    filteredProducts = filteredProducts.filter((p) => p.inStock === true);
  }

  // مرتب‌سازی
  if (searchParams.sortBy) {
    switch (searchParams.sortBy) {
      case "price_asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "discount_desc":
        filteredProducts.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case "rating_desc":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "sales_desc":
        filteredProducts.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case "newest":
        filteredProducts.sort(
          (a, b) => parseInt(b.id, 10) - parseInt(a.id, 10),
        );
        break;
    }
  }

  // محاسبه بازه قیمت
  const prices = productsData.map((p) => p.price);
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;

  return {
    products: filteredProducts,
    total: filteredProducts.length,
    filters: {
      categories: ["all", "silentbox", "accessory"],
      priceRange: { min, max },
    },
  };
}

// تابع برای گرفتن محصولات پرفروش (با مرتب‌سازی بهتر)
export function readBestSellingProducts(limit: number = 6): ProductRecord[] {
  const products = readProducts();
  
  // مرتب‌سازی بر اساس:
  // 1. isBestSeller
  // 2. salesCount
  // 3. rating
  return products
    .filter((p) => p.inStock === true)
    .sort((a, b) => {
      // اگر هر دو isBestSeller هستند یا هر دو نیستند
      if (a.isBestSeller === b.isBestSeller) {
        // اگر salesCount برابر بود، بر اساس rating مرتب کن
        if (b.salesCount === a.salesCount) {
          return b.rating - a.rating;
        }
        return b.salesCount - a.salesCount;
      }
      // محصولات isBestSeller اول می‌آیند
      return a.isBestSeller ? -1 : 1;
    })
    .slice(0, limit);
}

// تابع برای گرفتن محصولات با بیشترین تخفیف
export function readDiscountedProducts(limit: number = 6): ProductRecord[] {
  const products = readProducts();
  
  return products
    .filter((p) => p.inStock === true && p.discountPercent > 0)
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, limit);
}

// تابع برای گرفتن محصولات جدید (بر اساس ID)
export function readNewProducts(limit: number = 6): ProductRecord[] {
  const products = readProducts();
  
  return products
    .filter((p) => p.inStock === true)
    .sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10))
    .slice(0, limit);
}

// تابع برای گرفتن محصولات با بالاترین امتیاز
export function readTopRatedProducts(limit: number = 6): ProductRecord[] {
  const products = readProducts();
  
  return products
    .filter((p) => p.inStock === true && p.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// تابع برای جستجوی محصولات
export function searchProducts(query: string): ProductRecord[] {
  if (!query || query.trim() === "") {
    return [];
  }
  
  const searchTerm = query.trim().toLowerCase();
  const products = readProducts();
  
  return products.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  });
}

// تابع برای اضافه کردن محصول جدید (با validation)
export function addProduct(product: Omit<ProductRecord, "id">): ProductRecord {
  const products = readProducts();
  
  // تولید ID جدید
  const maxId = products.length > 0 
    ? Math.max(...products.map(p => parseInt(p.id, 10))) 
    : 0;
  const newId = (maxId + 1).toString();
  
  // نرمالایز کردن محصول جدید
  const newProduct: ProductRecord = normalizeProduct({
    ...product,
    id: newId,
  });
  
  products.push(newProduct);
  
  // ذخیره در فایل
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("[data/products] write error:", error);
  }
  
  return newProduct;
}

// تابع برای به‌روزرسانی محصول
export function updateProduct(
  id: string,
  updates: Partial<ProductRecord>
): ProductRecord | null {
  const products = readProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // به‌روزرسانی محصول
  const updatedProduct = normalizeProduct({
    ...products[index],
    ...updates,
    id, // حفظ ID اصلی
  });
  
  products[index] = updatedProduct;
  
  // ذخیره در فایل
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("[data/products] write error:", error);
  }
  
  return updatedProduct;
}

// تابع برای حذف محصول
export function deleteProduct(id: string): boolean {
  const products = readProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  
  if (filteredProducts.length === products.length) {
    return false;
  }
  
  // ذخیره در فایل
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(filteredProducts, null, 2));
    return true;
  } catch (error) {
    console.error("[data/products] write error:", error);
    return false;
  }
}

// تابع برای افزایش salesCount (بعد از خرید)
export function incrementSalesCount(id: string, amount: number = 1): boolean {
  const products = readProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return false;
  }
  
  products[index].salesCount = (products[index].salesCount || 0) + amount;
  
  // ذخیره در فایل
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error("[data/products] write error:", error);
    return false;
  }
}

// تابع برای گرفتن آمار محصولات
export function getProductsStats() {
  const products = readProducts();
  
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const totalSales = products.reduce((sum, p) => sum + (p.salesCount || 0), 0);
  const averageRating = products.reduce((sum, p) => sum + p.rating, 0) / totalProducts || 0;
  
  return {
    totalProducts,
    inStockProducts,
    outOfStockProducts,
    totalSales,
    averageRating: Math.round(averageRating * 10) / 10,
    categories: {
      silentbox: products.filter(p => p.category === "silentbox").length,
      accessory: products.filter(p => p.category === "accessory").length,
    },
  };
}