// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const contactData = {
  title: 'تماس با ما | سیلنت‌باکس',
  description: 'برای سوالات درباره محصولات سیلنت‌باکس، قیمت‌ها و پشتیبانی با ما در تماس باشید',
  
  hero: {
    title: 'ما مشتاق شنیدن صدای شما هستیم',
    subtitle: 'سوالی درباره محصولات سیلنت‌باکس دارید؟ نیاز به پشتیبانی دارید؟ تیم ما آماده کمک به شماست.',
    imageUrl: ''
  },
  
  contactInfo: {
    email: {
      primary: '',
      support: 'Siavash.m2020@gmail.com',
      sales: ''
    },
    phone: {
      primary: '۰۲۱۶۶۸۱۶۲۸۳',
      support: '۰۹۳۶۴۵۴۱۳۰۷',
      mobile: '۰۹۱۲۴۵۴۱۳۰۷',
      whatsapp: '۰۹۱۲۴۵۴۱۳۰۷'
    },
    address: {
      office: 'تهران،خیابان شاد آباد  خ سر حدی جنوبی کوچه ی چوپان ',
      factory: '',
      mapUrl: 'https://maps.google.com/?q=Tehran+Valiasr+Street'
    },
    workingHours: {
      weekdays: 'شنبه تا پنجشنبه: ۹:۰۰ - ۱۲:۰۰',
      thursday: ' ۱۵:۰۰ - ۲۱:۰۰',
      friday: 'جمعه: تعطیل'
    }
  },
  
  form: {
    title: 'ارسال پیام به ما',
    subtitle: 'فرم زیر را پر کنید، ما ظرف ۲۴ ساعت با شما تماس خواهیم گرفت',
    fields: {
      name: {
        label: 'نام و نام خانوادگی',
        placeholder: 'نام و نام خانوادگی خود را وارد کنید',
        required: true
      },
      email: {
        label: 'آدرس ایمیل',
        placeholder: 'ایمیل خود را وارد کنید',
        required: true
      },
      phone: {
        label: 'شماره تماس',
        placeholder: 'شماره تماس خود را وارد کنید',
        required: false
      },
      subject: {
        label: 'موضوع',
        placeholder: 'موضوع را انتخاب کنید',
        required: true,
        options: [
          'سوال عمومی',
          'اطلاعات محصول',
          'قیمت و استعلام',
          'پشتیبانی فنی',
          'سفارش عمده',
          'همکاری',
          'سایر موارد'
        ]
      },
      message: {
        label: 'پیام',
        placeholder: 'چگونه می‌توانیم به شما کمک کنیم؟...',
        required: true
      }
    },
    submitButton: 'ارسال پیام',
    successMessage: 'پیام شما با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت.',
    errorMessage: 'خطایی رخ داد. لطفاً مجدداً تلاش کنید.'
  },
  
  socialMedia: {
    title: 'ما را دنبال کنید',
    instagram: '۰۹۱۲۴۵۴۱۳۰۷',
    twitter: '۰۹۱۲۴۵۴۱۳۰۷',
    linkedin: '۰۹۱۲۴۵۴۱۳۰۷',
    telegram: '۰۹۱۲۴۵۴۱۳۰۷',
    whatsapp: '۰۹۱۲۴۵۴۱۳۰۷'
  },
  
  faq: {
    title: 'سوالات متداول',
    items: [
      {
        question: 'زمان تحویل سفارش چقدر است؟',
        answer: '  طی،۱ روز نهایت ۲ روز ارسالی میشه'
      },
      {
        question: 'آیا به خارج از ایران ارسال دارید؟',
        answer: 'در حال حاضر فقط داخل ایران ارسال داریم. برای استعلامات بین‌المللی لطفاً با تیم فروش ما تماس بگیرید.'
      },
      {
        question: 'گارانتی محصولات چقدر است؟',
        answer: 'فقط،موتور شامل گارنتی ۲ ماه می باشد'
      },
      {
        question: 'آیا امکان بازگشت کالا وجود دارد؟',
        answer: 'در ۲۴ ساعت ۹۰ درصد پول برگشت می خوره و بیش از ۴۸ ساعت ۶۰ درصد پول برگشت می خوره'
      }
    ]
  }
};

// مسیر فایل contacts.json در ریشه پروژه
const contactsFilePath = path.join(process.cwd(), 'contacts.json');

// تابع برای خواندن پیام‌ها از فایل
async function getMessages() {
  try {
    const data = await fs.readFile(contactsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    // اگر فایل وجود نداشت، یک آرایه خالی برمی‌گردونیم
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// تابع برای ذخیره پیام‌ها در فایل
async function saveMessages(messages: any[]) {
  await fs.writeFile(contactsFilePath, JSON.stringify(messages, null, 2), 'utf-8');
}

export async function GET() {
  try {
    return NextResponse.json(contactData, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=180',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات تماس' },
      { status: 500 }
    );
  }
}

// POST endpoint for form submission
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'لطفاً تمام فیلدهای ضروری را پر کنید' },
        { status: 400 }
      );
    }
    
    // خواندن پیام‌های موجود
    const messages = await getMessages();
    
    // ایجاد پیام جدید
    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'pending', // pending, read, replied
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // اضافه کردن به ابتدای آرایه (جدیدترین اول)
    messages.unshift(newMessage);
    
    // ذخیره در فایل
    await saveMessages(messages);
    
    console.log('Message saved successfully:', newMessage.id);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت!'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: 'خطا در ارسال پیام. لطفاً مجدداً تلاش کنید.' },
      { status: 500 }
    );
  }
}