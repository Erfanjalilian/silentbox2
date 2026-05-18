import fs from "fs";
import path from "path";

const articlesFilePath = path.join(process.cwd(), "articles.json");

export interface ArticleRecord {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
}

export function readArticles(): ArticleRecord[] {
  try {
    if (!fs.existsSync(articlesFilePath)) {
      return [];
    }
    const data = fs.readFileSync(articlesFilePath, "utf8");
    return JSON.parse(data) as ArticleRecord[];
  } catch (error) {
    console.error("[data/articles] read error:", error);
    return [];
  }
}

export function getArticleById(id: string): ArticleRecord | null {
  return readArticles().find((a) => a.id === id) ?? null;
}
