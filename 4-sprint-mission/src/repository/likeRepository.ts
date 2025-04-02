import prisma from "../lib/prisma.js";
import { ProductLike, ArticleLike } from "@prisma/client";
import { createArticleLike, createProductLike } from "../dto/likeDTO";

async function productLike(
  productData: createProductLike
): Promise<ProductLike | null> {
  return prisma.productLike.findUnique({
    where: {
      userId_productId: {
        ...productData,
      },
    },
  });
}

async function productLikeCancel(
  productData: createProductLike
): Promise<ProductLike> {
  return prisma.productLike.delete({
    where: {
      userId_productId: {
        ...productData,
      },
    },
  });
}

async function prouductLikeCreate(
  productData: createProductLike,
  isLiked: boolean
): Promise<ProductLike> {
  return prisma.productLike.create({
    data: {
      ...productData,
      isLiked: isLiked,
    },
  });
}

async function articleLike(
  likeId: createArticleLike
): Promise<ArticleLike | null> {
  return prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        ...likeId,
      },
    },
  });
}

async function articleLikeCancel(
  likeId: createArticleLike
): Promise<ArticleLike> {
  return prisma.articleLike.delete({
    where: {
      userId_articleId: {
        ...likeId,
      },
    },
  });
}

async function articleLikeCreate(
  likeId: createArticleLike,
  isLiked: boolean
): Promise<ArticleLike> {
  return prisma.articleLike.create({
    data: {
      ...likeId,
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
