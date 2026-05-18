// app/api/admin/contacts/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const contactsFilePath = path.join(process.cwd(), 'contacts.json');

async function getMessages() {
  try {
    const data = await fs.readFile(contactsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveMessages(messages: any[]) {
  await fs.writeFile(contactsFilePath, JSON.stringify(messages, null, 2), 'utf-8');
}

// GET: دریافت لیست پیام‌ها
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let messages = await getMessages();

    // فیلتر بر اساس وضعیت
    if (status && status !== 'all') {
      messages = messages.filter((m: any) => m.status === status);
    }

    // جستجو
    if (search) {
      messages = messages.filter((m: any) => 
        m.name.includes(search) || 
        m.email.includes(search) || 
        m.message.includes(search) ||
        m.phone.includes(search)
      );
    }

    // Pagination
    const total = messages.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedMessages = messages.slice(start, end);

    return NextResponse.json({
      contacts: paginatedMessages,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت پیام‌ها' },
      { status: 500 }
    );
  }
}

// PUT: به‌روزرسانی وضعیت پیام
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, reply } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'آیدی پیام الزامی است' },
        { status: 400 }
      );
    }

    let messages = await getMessages();
    const messageIndex = messages.findIndex((m: any) => m.id === id);

    if (messageIndex === -1) {
      return NextResponse.json(
        { error: 'پیام یافت نشد' },
        { status: 404 }
      );
    }

    // به‌روزرسانی وضعیت
    messages[messageIndex].status = status;
    messages[messageIndex].updatedAt = new Date().toISOString();
    
    if (reply) {
      messages[messageIndex].reply = reply;
      messages[messageIndex].repliedAt = new Date().toISOString();
    }

    await saveMessages(messages);

    return NextResponse.json({
      success: true,
      message: 'وضعیت پیام با موفقیت به‌روزرسانی شد'
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی پیام' },
      { status: 500 }
    );
  }
}

// DELETE: حذف پیام
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'آیدی پیام الزامی است' },
        { status: 400 }
      );
    }

    let messages = await getMessages();
    const filteredMessages = messages.filter((m: any) => m.id !== id);

    if (messages.length === filteredMessages.length) {
      return NextResponse.json(
        { error: 'پیام یافت نشد' },
        { status: 404 }
      );
    }

    await saveMessages(filteredMessages);

    return NextResponse.json({
      success: true,
      message: 'پیام با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'خطا در حذف پیام' },
      { status: 500 }
    );
  }
}