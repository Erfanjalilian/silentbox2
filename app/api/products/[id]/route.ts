// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

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

const productsFilePath = path.join(process.cwd(), 'products.json');

function getProducts(): Product[] {
  try {
    if (!fs.existsSync(productsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(data);
    
    // اطمینان از وجود فیلدهای جدید در محصولات قدیمی
    return products.map((p: any) => ({
      ...p,
      discountPercent: p.discountPercent ?? p.discount ?? 0,
      salesCount: p.salesCount ?? 0,
      images: p.images ?? (p.imageUrl ? [p.imageUrl] : [])
    }));
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

function saveProducts(products: Product[]) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error saving products file:', error);
  }
}

// ✅ GET - دریافت یک محصول بر اساس ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching product with ID:', id);
    
    const productsData = getProducts();
    const product = productsData.find(p => p.id === id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// ✅ PUT - ویرایش کامل یک محصول
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('Updating product with ID:', id);
    
    let productsData = getProducts();
    const productIndex = productsData.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // به‌روزرسانی محصول
    const updatedProduct: Product = {
      id: id, // حفظ ID اصلی
      name: body.name ?? productsData[productIndex].name,
      price: body.price ?? productsData[productIndex].price,
      originalPrice: body.originalPrice ?? productsData[productIndex].originalPrice,
      discount: body.discount ?? productsData[productIndex].discount,
      discountPercent: body.discountPercent ?? body.discount ?? productsData[productIndex].discountPercent,
      rating: body.rating ?? productsData[productIndex].rating,
      reviewCount: body.reviewCount ?? productsData[productIndex].reviewCount,
      salesCount: body.salesCount ?? productsData[productIndex].salesCount,
      description: body.description ?? productsData[productIndex].description,
      features: body.features ?? productsData[productIndex].features,
      imageUrl: body.imageUrl ?? (body.images?.[0] ?? productsData[productIndex].imageUrl),
      images: body.images ?? (body.imageUrl ? [body.imageUrl] : productsData[productIndex].images),
      category: body.category ?? productsData[productIndex].category,
      inStock: body.inStock ?? productsData[productIndex].inStock,
      isBestSeller: body.isBestSeller ?? productsData[productIndex].isBestSeller,
      badge: body.badge !== undefined ? body.badge : productsData[productIndex].badge,
    };
    
    productsData[productIndex] = updatedProduct;
    saveProducts(productsData);
    
    return NextResponse.json(
      { 
        message: 'Product updated successfully', 
        product: updatedProduct 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// ✅ PATCH - ویرایش جزئی یک محصول
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('Partially updating product with ID:', id);
    
    let productsData = getProducts();
    const productIndex = productsData.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // به‌روزرسانی جزئی
    const updatedProduct: Product = {
      ...productsData[productIndex],
      ...body,
      id: id, // حفظ ID اصلی
      // اگر imageUrl نیومده ولی images اومده، imageUrl رو از اولین عکس بگیر
      imageUrl: body.imageUrl ?? (body.images?.[0] ?? productsData[productIndex].imageUrl),
      // اگر images نیومده ولی imageUrl اومده، images رو بساز
      images: body.images ?? (body.imageUrl ? [body.imageUrl] : productsData[productIndex].images),
    };
    
    productsData[productIndex] = updatedProduct;
    saveProducts(productsData);
    
    return NextResponse.json(
      { 
        message: 'Product partially updated successfully', 
        product: updatedProduct 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PATCH:', error);
    return NextResponse.json(
      { error: 'Failed to partially update product' },
      { status: 500 }
    );
  }
}

// ✅ DELETE - حذف یک محصول
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('Deleting product with ID:', id);
    
    let productsData = getProducts();
    const initialLength = productsData.length;
    const filteredProducts = productsData.filter(p => p.id !== id);
    
    if (filteredProducts.length === initialLength) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    saveProducts(filteredProducts);
    
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