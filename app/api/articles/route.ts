// app/api/articles/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const articlesFilePath = path.join(process.cwd(), 'articles.json');

// تابع برای خواندن مقالات از فایل JSON
function getArticles(): any[] {
  try {
    if (!fs.existsSync(articlesFilePath)) {
      // داده‌های اولیه
      const initialArticles = [
        {
          id: '1',
          title: 'آشنایی با استخراج ارزهای دیجیتال',
          summary: 'راهنمای کامل برای شروع استخراج ارزهای دیجیتال، تجهیزات مورد نیاز و سودآوری',
          content: 'متن کامل مقاله...',
          imageUrl: '',
          category: 'آموزشی',
          readTime: '۵ دقیقه',
          date: '۱۴۰۳/۰۸/۱۵',
          author: 'عرفان جلیلیان'
        },
        {
          id: '2',
          title: 'بهترین تجهیزات استخراج در سال ۲۰۲۴',
          summary: 'بررسی تخصصی بهترین دستگاه‌های استخراج و مقایسه بازدهی آنها',
          content: 'متن کامل مقاله...',
          imageUrl: '',
          category: 'تجهیزات',
          readTime: '۸ دقیقه',
          date: '۱۴۰۳/۰۸/۱۰',
          author: 'عرفان جلیلیان'
        },
        {
          id: '3',
          title: 'تاثیر استخراج بر محیط زیست و راهکارهای سبز',
          summary: 'بررسی اثرات زیست‌محیطی استخراج و روش‌های کاهش مصرف انرژی',
          content: 'متن کامل مقاله...',
          imageUrl: '',
          category: 'محیط زیست',
          readTime: '۶ دقیقه',
          date: '۱۴۰۳/۰۸/۰۵',
          author: 'عرفان جلیلیان'
        },
        {
          id: '4',
          title: 'آینده استخراج پس از هاوینگ بیت‌کوین',
          summary: 'تحلیل تغییرات بازار استخراج بعد از نصف شدن پاداش بلاک',
          content: 'متن کامل مقاله...',
          imageUrl: '',
          category: 'تحلیل',
          readTime: '۷ دقیقه',
          date: '۱۴۰۳/۰۷/۲۸',
          author: 'عرفان جلیلیان'
        },
        {
          id: '5',
          title: 'استخراج ابری: مزایا و معایب',
          summary: 'آیا استخراج ابری ارزش سرمایه‌گذاری دارد؟ بررسی کامل روش‌های کلود ماینینگ',
          content: 'متن کامل مقاله...',
          imageUrl: '',
          category: 'بررسی',
          readTime: '۴ دقیقه',
          date: '۱۴۰۳/۰۷/۲۰',
          author: 'عرفان جلیلیان'
        },
        {
          id: '6',
          title: 'راهنمای انتخاب استخر استخراج مناسب',
          summary: 'معیارهای مهم برای انتخاب بهترین استخر استخراج و افزایش درآمد',
          content: 'متن کامل مقاله...',
          imageUrl: '',
          category: 'راهنما',
          readTime: '۶ دقیقه',
          date: '۱۴۰۳/۰۷/۱۵',
          author: 'عرفان جلیلیان'
        }
      ];
      fs.writeFileSync(articlesFilePath, JSON.stringify(initialArticles, null, 2));
      return initialArticles;
    }
    const data = fs.readFileSync(articlesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading articles file:', error);
    return [];
  }
}

// تابع برای نوشتن مقالات در فایل JSON
function saveArticles(articles: any[]) {
  try {
    fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2));
  } catch (error) {
    console.error('Error saving articles:', error);
  }
}

// GET - دریافت لیست مقالات
export async function GET() {
  try {
    const articles = getArticles();
    return NextResponse.json(articles, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// ✅ POST - افزودن مقاله جدید (اصلاح شده)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const articles = getArticles();
    
    // تولید ID جدید
    const maxId = articles.length > 0 
      ? Math.max(...articles.map((a: any) => parseInt(a.id))) 
      : 0;
    const newId = (maxId + 1).toString();
    
    const newArticle = {
      id: newId,
      title: body.title,
      summary: body.summary || '',
      content: body.content || '',
      imageUrl: body.imageUrl || '',
      category: body.category || 'عمومی',
      readTime: body.readTime || '۵ دقیقه',
      date: new Date().toLocaleDateString('fa-IR'),
      author: body.author || 'عرفان جلیلیان'
    };
    
    articles.push(newArticle);
    saveArticles(articles);
    
    return NextResponse.json(
      { message: 'مقاله با موفقیت اضافه شد', article: newArticle },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد مقاله' },
      { status: 500 }
    );
  }
}