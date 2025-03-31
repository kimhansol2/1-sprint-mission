import prisma from "../lib/prisma.js";
import { ProductLike, ArticleLike } from "@prisma/client";

type UserProductId = {
  userId: number;
  productId: number;
};

type UserArticleId = {
  userId: number;
  articleId: number;
};

async function productLike({
  userId,
  productId,
}: UserProductId): Promise<ProductLike | null> {
  return prisma.productLike.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

async function productLikeCancel({
  userId,
  productId,
}: UserProductId): Promise<ProductLike> {
  return prisma.productLike.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

async function prouductLikeCreate(
  { userId, productId }: UserProductId,
  isLiked: boolean
): Promise<ProductLike> {
  return prisma.productLike.create({
    data: {
      userId,
      productId,
      isLiked: isLiked,
    },
  });
}

async function articleLike({
  userId,
  articleId,
}: UserArticleId): Promise<ArticleLike | null> {
  return prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}

async function articleLikeCancel({
  userId,
  articleId,
}: UserArticleId): Promise<ArticleLike> {
  return prisma.articleLike.delete({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}

async function articleLikeCreate(
  { userId, articleId }: UserArticleId,
  isLiked: boolean
): Promise<ArticleLike> {
  return prisma.articleLike.create({
    data: {
      userId,
      articleId,
      isLiked: isLiked,
    },
  });
}

async function findLikedProducts(
  id: number,
  page: number,
  pagesize: number
): Promise<ProductLike[]> {
  return prisma.productLike.findMany({
    where: {
      userId: id,
      isLiked: true,
    },
    skip: (page - 1) * pagesize,
    take: pagesize,
    include: {
      product: true,
    },
  });
}

export default {
  productLike,
  productLikeCancel,
  prouductLikeCreate,
  articleLike,
  articleLikeCancel,
  articleLikeCreate,
  findLikedProducts,
};
