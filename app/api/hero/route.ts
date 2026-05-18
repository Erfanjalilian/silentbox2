// app/api/hero/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

// مسیر فایل JSON برای ذخیره دیتای هیرو
const heroDataFilePath = path.join(process.cwd(), 'hero-data.json');

// دیتای پیش‌فرض هیرو
const defaultHeroData = {
  imageUrl: '',
  title: 'به دنیای سایلنت باکس خوش آمدید',
  subtitle: 'با کیفیت‌ترین سایلنت‌باکس‌ها و لوازم جانبی ماینینگ',
  buttonText: 'مشاهده محصولات',
  buttonLink: '/products'
};

// تابع برای خواندن دیتای هیرو از فایل JSON
function getHeroData() {
  try {
    if (!fs.existsSync(heroDataFilePath)) {
      // اگر فایل وجود نداشت، دیتای پیش‌فرض را ذخیره کن
      fs.writeFileSync(heroDataFilePath, JSON.stringify(defaultHeroData, null, 2));
      return defaultHeroData;
    }
    const data = fs.readFileSync(heroDataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading hero data:', error);
    return defaultHeroData;
  }
}

// تابع برای نوشتن دیتای هیرو در فایل JSON
function saveHeroData(data: any) {
  try {
    fs.writeFileSync(heroDataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving hero data:', error);
  }
}

// GET - دریافت دیتای هیرو
export async function GET() {
  try {
    const heroData = getHeroData();
    return NextResponse.json(heroData, { 
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=180',
      },
    });
  } catch (error) {
    console.error('Error in GET hero:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero data' },
      { status: 500 }
    );
  }
}

// POST - آپلود عکس و ذخیره دیتای هیرو
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const action = formData.get('action');
    
    // اگر اکشن آپلود عکس باشد
    if (action === 'upload') {
      const file = formData.get('image') as File;
      
      if (!file) {
        return NextResponse.json(
          { error: 'هیچ فایلی آپلود نشده' },
          { status: 400 }
        );
      }
      
      // بررسی نوع فایل
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'فرمت فایل باید JPEG، PNG یا WebP باشد' },
          { status: 400 }
        );
      }
      
      // بررسی حجم فایل (حداکثر 5 مگابایت)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'حجم فایل نباید بیشتر از 5 مگابایت باشد' },
          { status: 400 }
        );
      }
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // ایجاد نام یکتا برای فایل
      const ext = path.extname(file.name);
      const uniqueName = `hero-${Date.now()}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads/hero');
      const filePath = path.join(uploadDir, uniqueName);
      
      // ایجاد پوشه اگر وجود ندارد
      await mkdir(uploadDir, { recursive: true });
      
      // ذخیره فایل
      await writeFile(filePath, buffer);
      
      // برگرداندن لینک عمومی
      const imageUrl = `/uploads/hero/${uniqueName}`;
      
      return NextResponse.json({ 
        success: true, 
        url: imageUrl,
        message: 'عکس با موفقیت آپلود شد'
      }, { status: 200 });
    }
    
    // اگر اکشن ذخیره دیتا باشد
    if (action === 'save') {
      const title = formData.get('title') as string;
      const subtitle = formData.get('subtitle') as string;
      const buttonText = formData.get('buttonText') as string;
      const buttonLink = formData.get('buttonLink') as string;
      const imageUrl = formData.get('imageUrl') as string;
      
      const heroData = {
        imageUrl: imageUrl || '',
        title: title || defaultHeroData.title,
        subtitle: subtitle || defaultHeroData.subtitle,
        buttonText: buttonText || defaultHeroData.buttonText,
        buttonLink: buttonLink || defaultHeroData.buttonLink,
      };
      
      saveHeroData(heroData);
      
      return NextResponse.json({ 
        success: true, 
        message: 'دیتا با موفقیت ذخیره شد',
        data: heroData
      }, { status: 200 });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error in POST hero:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست' },
      { status: 500 }
    );
  }
}

// PUT - به‌روزرسانی دیتای هیرو (بدون آپلود عکس)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, buttonText, buttonLink, imageUrl } = body;
    
    const heroData = {
      imageUrl: imageUrl || '',
      title: title || defaultHeroData.title,
      subtitle: subtitle || defaultHeroData.subtitle,
      buttonText: buttonText || defaultHeroData.buttonText,
      buttonLink: buttonLink || defaultHeroData.buttonLink,
    };
    
    saveHeroData(heroData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'دیتا با موفقیت به‌روزرسانی شد',
      data: heroData
    }, { status: 200 });
  } catch (error) {
    console.error('Error in PUT hero:', error);
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی دیتا' },
      { status: 500 }
    );
  }
}