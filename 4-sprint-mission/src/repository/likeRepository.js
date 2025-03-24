import prisma from "../lib/prisma.js";

async function like(userId, productId) {
  return prisma.like.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

async function likeCancel(userId, productId) {
  return prisma.like.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

async function likeCreate(userId, productId) {
  return prisma.like.create({
    data: {
      userId,
      productId,
    },
  });
}

export default {
  like,
  likeCancel,
  likeCreate,
};
