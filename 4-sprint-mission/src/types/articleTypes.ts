import { Prisma, Article as PrismaArticle } from "@prisma/client";

export type Article = PrismaArticle;

export type ArticleCreateData = {
  title: string;
  content: string;
  image?: string | null;
  userId: number;
};

export type ArticleUpdateDate = {
  title?: string;
  content?: string;
  image?: string;
};
