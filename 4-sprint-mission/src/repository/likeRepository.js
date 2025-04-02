import prisma from "../lib/prisma.js";

async function productLike(userId, productId) {
  return prisma.productLike.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

async function productLikeCancel(userId, productId) {
  return prisma.productLike.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

async function prouductLikeCreate(userId, productId, isLiked) {
  return prisma.productLike.create({
    data: {
      userId,
      productId,
      isLiked: isLiked,
    },
  });
}

async function articleLike(userId, articleId) {
  return prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}

async function articleLikeCancel(userId, articleId) {
  return prisma.articleLike.delete({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}

async function articleLikeCreate(userId, articleId, isLiked) {
  return prisma.articleLike.create({
    data: {
      userId,
      articleId,
      isLiked: isLiked,
    },
  });
}

async function findLikedProducts(id, page, pagesize) {
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
