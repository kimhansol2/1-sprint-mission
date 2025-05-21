import prisma from '../lib/prisma';
import { ProductLike, ArticleLike } from '@prisma/client';
import { createArticleLike, createProductLike } from '../dto/likeDTO';

export async function productLike(productData: createProductLike): Promise<ProductLike | null> {
  return prisma.productLike.findUnique({
    where: {
      userId_productId: {
        ...productData,
      },
    },
  });
}

export async function productLikeCancel(productData: createProductLike): Promise<ProductLike> {
  return prisma.productLike.delete({
    where: {
      userId_productId: {
        ...productData,
      },
    },
  });
}

export async function prouductLikeCreate(productData: createProductLike): Promise<ProductLike> {
  return prisma.productLike.create({
    data: {
      ...productData,
    },
  });
}

export async function articleLike(likeId: createArticleLike): Promise<ArticleLike | null> {
  return prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        ...likeId,
      },
    },
  });
}

export async function articleLikeCancel(likeId: createArticleLike): Promise<ArticleLike> {
  return prisma.articleLike.delete({
    where: {
      userId_articleId: {
        ...likeId,
      },
    },
  });
}

export async function articleLikeCreate(likeId: createArticleLike): Promise<ArticleLike> {
  return prisma.articleLike.create({
    data: {
      ...likeId,
    },
  });
}

export async function findLikedProducts(
  id: number,
  page: number,
  pagesize: number,
): Promise<ProductLike[]> {
  return prisma.productLike.findMany({
    where: {
      userId: id,
    },
    skip: (page - 1) * pagesize,
    take: pagesize,
    include: {
      product: true,
    },
  });
}

export async function porductLikedFindPerson(productId: number) {
  return prisma.productLike.findMany({
    where: { productId },
    select: { userId: true },
  });
}
