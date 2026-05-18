import fs from "fs";
import path from "path";

const productsFilePath = path.join(process.cwd(), "products.json");

export interface ProductRecord {
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

export function readProducts(): ProductRecord[] {
  try {
    if (!fs.existsSync(productsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(productsFilePath, "utf8");
    return JSON.parse(data) as ProductRecord[];
  } catch (error) {
    console.error("[data/products] read error:", error);
    return [];
  }
}

export function getProductById(id: string): ProductRecord | null {
  return readProducts().find((p) => p.id === id) ?? null;
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

export function queryProducts(
  searchParams: ProductListQuery,
): ProductsListResult {
  const productsData = readProducts();
  let filteredProducts = [...productsData];

  if (searchParams.category && searchParams.category !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === searchParams.category,
    );
  }

  if (searchParams.minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= parseInt(searchParams.minPrice!, 10),
    );
  }

  if (searchParams.maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseInt(searchParams.maxPrice!, 10),
    );
  }

  if (searchParams.inStock === "true") {
    filteredProducts = filteredProducts.filter((p) => p.inStock === true);
  }

  if (searchParams.sortBy) {
    switch (searchParams.sortBy) {
      case "price_asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "discount_desc":
        filteredProducts.sort((a, b) => b.discount - a.discount);
        break;
      case "rating_desc":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filteredProducts.sort(
          (a, b) => parseInt(b.id, 10) - parseInt(a.id, 10),
        );
        break;
    }
  }

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

export function readBestSellingProducts(): ProductRecord[] {
  return readProducts().filter((p) => p.isBestSeller === true);
}
