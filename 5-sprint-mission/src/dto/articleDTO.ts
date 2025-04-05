import { Article as PrismaArticle } from '@prisma/client';

export interface Article extends PrismaArticle {}

export function articleResponseDTO(article: Article) {
  return {
    id: article.id,
    title: article.title,
    content: article.content,
    image: article.image,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    userId: article.userId,
  };
}

export interface ArticleCreateData {
  title: string;
  content: string;
  image?: string | null;
  userId: number;
}

export interface ArticleUpdateData {
  userId?: number;
  title?: string;
  content?: string;
  image?: string | null;
  id?: number;
}
