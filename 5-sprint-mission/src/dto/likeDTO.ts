import { ArticleLike as PrismaArticleLike } from "@prisma/client";

export interface ArticleLike extends PrismaArticleLike {}

export interface createArticleLike {
  userId: number;
  articleId: number;
}

export interface createProductLike {
  userId: number;
  productId: number;
}
