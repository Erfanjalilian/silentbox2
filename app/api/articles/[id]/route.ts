// app/api/articles/[id]/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const articlesFilePath = path.join(process.cwd(), 'articles.json');

function getArticles(): any[] {
  try {
    if (!fs.existsSync(articlesFilePath)) {
      return [];
    }
    const data = fs.readFileSync(articlesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveArticles(articles: any[]) {
  fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2));
}

// GET - دریافت یک مقاله
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articles = getArticles();
    const article = articles.find((a: any) => a.id === id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PUT - ویرایش مقاله
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    let articles = getArticles();
    const index = articles.findIndex((a: any) => a.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    articles[index] = {
      ...articles[index],
      ...body,
      id: id,
    };
    
    saveArticles(articles);
    
    return NextResponse.json(articles[index], { status: 200 });
  } catch (error) {
    console.error('Error in PUT:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// ✅ DELETE - حذف مقاله
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let articles = getArticles();
    const initialLength = articles.length;
    articles = articles.filter((a: any) => a.id !== id);
    
    if (articles.length === initialLength) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    saveArticles(articles);
    
    return NextResponse.json(
      { message: 'Article deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}