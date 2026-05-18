// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'هیچ فایلی آپلود نشده' }, { status: 400 });
    }
    
    // بررسی نوع فایل
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'فرمت فایل پشتیبانی نمی‌شود' }, { status: 400 });
    }
    
    // بررسی حجم فایل (حداکثر 5 مگابایت)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'حجم فایل نباید بیشتر از 5 مگابایت باشد' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // ایجاد نام یکتا برای فایل
    const ext = path.extname(file.name);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads/products');
    const filePath = path.join(uploadDir, uniqueName);
    
    // ایجاد پوشه اگر وجود ندارد
    await mkdir(uploadDir, { recursive: true });
    
    // ذخیره فایل
    await writeFile(filePath, buffer);
    
    // برگرداندن لینک عمومی
    const imageUrl = `/uploads/products/${uniqueName}`;
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      message: 'عکس با موفقیت آپلود شد'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'خطا در آپلود عکس' }, { status: 500 });
  }
}