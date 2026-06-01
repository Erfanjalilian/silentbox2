// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

// مسیر فایل JSON برای ذخیره محصولات
const productsFilePath = path.join(process.cwd(), 'products.json');

// تایپ محصول
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  description: string;
  features: string[];
  imageUrl: string;
  images: string[];
  category: string;
  inStock: boolean;
  isBestSeller: boolean;
  badge: string | null;
}

// تابع برای خواندن محصولات از فایل JSON
function getProducts(): Product[] {
  try {
    if (!fs.existsSync(productsFilePath)) {
      // داده‌های اولیه با ساختار جدید
      const initialProducts: Product[] = [
        {
          id: '7',
          name: "سایلنت باکس برای ۳ عدد ماینر بدون کنترل از راه دور",
          price: 18000000,
          originalPrice: 20180000,
          discount: 14,
          discountPercent: 15,
          rating: 4.9,
          reviewCount: 0,
          salesCount: 71,
          description: "این مدل طراحی شده برای سه عدد ماینر معمولی یا دو عدد ماینر هوشمند S19 ....",
          features: [],
          imageUrl: "/uploads/products/1778316834341-uxch29.jpg",
          images: [
            "/uploads/products/1778316834341-uxch29.jpg",
            "/uploads/products/placeholder-1.jpg",
            "/uploads/products/placeholder-2.jpg"
          ],
          category: "silentbox",
          inStock: true,
          isBestSeller: true,
          badge: null
        },
        {
          id: '19',
          name: "سایلنت باکس برای ماینر های معمولی تا حرفه ای بدون کنترل از راه دور",
          price: 12000000,
          originalPrice: 15000000,
          discount: 14,
          discountPercent: 14,
          rating: 0,
          reviewCount: 0,
          salesCount: 0,
          description: "این مدل سایلنت باکس طراحی شده برای تمامی ماینرهای معمولی...",
          features: [],
          imageUrl: "/uploads/products/1779282082465-cu0sq6.webp",
          images: [
            "/uploads/products/1779282082465-cu0sq6.webp",
            "/uploads/products/placeholder-1.jpg",
            "/uploads/products/placeholder-2.jpg"
          ],
          category: "silentbox",
          inStock: true,
          isBestSeller: true,
          badge: "پرفروش ترین"
        }
      ];
      fs.writeFileSync(productsFilePath, JSON.stringify(initialProducts, null, 2));
      return initialProducts;
    }
    
    const data = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(data);
    
    // اطمینان از وجود فیلدهای جدید در محصولات قدیمی
    return products.map((p: any) => ({
      ...p,
      discountPercent: p.discountPercent || p.discount || 0,
      salesCount: p.salesCount || 0,
      images: p.images || (p.imageUrl ? [p.imageUrl] : [])
    }));
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

// تابع برای نوشتن محصولات در فایل JSON
function saveProducts(products: Product[]) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error saving products file:', error);
  }
}

// GET - گرفتن لیست محصولات (با فیلترها)
export async function GET(request: NextRequest) {
  try {
    const productsData = getProducts();
    const searchParams = request.nextUrl.searchParams;
    const getAll = searchParams.get('getAll');
    
    // اگر getAll true نباشه، فقط محصولات پرفروش رو برگردون (برای صفحه اصلی)
    if (getAll !== 'true') {
      const bestSellers = productsData.filter(product => product.isBestSeller === true);
      return NextResponse.json(bestSellers, {
        status: 200,
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
        },
      });
    }
    
    // اعمال فیلترها برای صفحه محصولات
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const sortBy = searchParams.get('sortBy');
    
    let filteredProducts = [...productsData];
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
    }
    
    if (inStock === 'true') {
      filteredProducts = filteredProducts.filter(p => p.inStock === true);
    }
    
    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'discount_desc':
          filteredProducts.sort((a, b) => (b.discountPercent || b.discount) - (a.discountPercent || a.discount));
          break;
        case 'rating_desc':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'sales_desc':
          filteredProducts.sort((a, b) => b.salesCount - a.salesCount);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          break;
      }
    }
    
    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
      filters: {
        categories: ['all', 'silentbox', 'accessory'],
        priceRange: {
          min: Math.min(...productsData.map(p => p.price)),
          max: Math.max(...productsData.map(p => p.price))
        }
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// ✅ POST - اضافه کردن محصول جدید (ذخیره در فایل JSON)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productsData = getProducts();
    
    // تولید ID جدید
    const maxId = productsData.length > 0 
      ? Math.max(...productsData.map(p => parseInt(p.id))) 
      : 0;
    const newId = (maxId + 1).toString();
    
    const newProduct: Product = {
      id: newId,
      name: body.name,
      price: body.price,
      originalPrice: body.originalPrice || body.price,
      discount: body.discount || 0,
      discountPercent: body.discountPercent || body.discount || 0,
      rating: 0,
      reviewCount: 0,
      salesCount: 0,
      description: body.description || '',
      features: body.features || [],
      imageUrl: body.imageUrl || (body.images?.[0] || ''),
      images: body.images || (body.imageUrl ? [body.imageUrl] : []),
      category: body.category || 'silentbox',
      inStock: body.inStock ?? true,
      isBestSeller: body.isBestSeller ?? false,
      badge: body.badge || null,
    };
    
    productsData.push(newProduct);
    saveProducts(productsData);
    
    return NextResponse.json(
      { message: 'محصول با موفقیت اضافه شد', product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد محصول' },
      { status: 500 }
    );
  }
}

// ✅ PUT - ویرایش محصول
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    let productsData = getProducts();
    const productIndex = productsData.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // به‌روزرسانی محصول
    productsData[productIndex] = {
      ...productsData[productIndex],
      ...updateData,
      id: id, // حفظ ID اصلی
      // اطمینان از وجود فیلدهای ضروری
      images: updateData.images || (updateData.imageUrl ? [updateData.imageUrl] : productsData[productIndex].images),
      imageUrl: updateData.imageUrl || productsData[productIndex].imageUrl,
    };
    
    saveProducts(productsData);
    
    return NextResponse.json(
      { message: 'محصول با موفقیت ویرایش شد', product: productsData[productIndex] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT:', error);
    return NextResponse.json(
      { error: 'خطا در ویرایش محصول' },
      { status: 500 }
    );
  }
}

// ✅ DELETE - حذف محصول از فایل JSON
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    let productsData = getProducts();
    const initialLength = productsData.length;
    productsData = productsData.filter(p => p.id !== id);
    
    if (productsData.length === initialLength) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    saveProducts(productsData);
    
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

// ✅ GET by ID - گرفتن یک محصول خاص
export async function GET_PRODUCT_BY_ID(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productsData = getProducts();
    const product = productsData.find(p => p.id === params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}