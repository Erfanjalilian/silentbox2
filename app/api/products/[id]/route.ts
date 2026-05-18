// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'products.json');

function getProducts(): any[] {
  try {
    if (!fs.existsSync(productsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveProducts(products: any[]) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

// ✅ درست برای Next.js 15 - استفاده از await برای params
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // مهم: باید از await استفاده کنی چون params یک Promise است
    const { id } = await params;
    
    console.log('Deleting product with ID:', id);
    
    const productsData = getProducts();
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

// ✅ همین کار را برای GET و PUT هم انجام بده
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Editing products via API is disabled. Return 405 Method Not Allowed.
  return NextResponse.json(
    { error: 'Editing products is disabled' },
    { status: 405 }
  );
}