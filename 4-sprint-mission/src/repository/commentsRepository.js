import prisma from "../lib/prisma.js";
async function findCommentsByArticle(articleId, cursor, limit) {
  return prisma.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit,
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
}

async function findCommentsByProduct(productId, cursor, limit) {
  return prisma.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit,
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
}

async function findById(id) {
  return prisma.comment.findUnique({ where: { id } });
}

async function update(id, content) {
  return prisma.comment.update({
    where: { id },
    data: { content },
  });
}

async function deleteId(id) {
  return prisma.comment.delete({
    where: { id },
  });
}

async function commentArticle(articleId, content, user) {
  return await prisma.comment.create({
    data: {
      content,
      article: { connect: { id: articleId } },
      user: { connect: { id: user } },
    },
  });
}

async function commentProduct(productId, content, user) {
  return await prisma.comment.create({
    data: {
      content,
      product: { connect: { id: productId } },
      user: { connect: { id: user } },
    },
  });
}

export default {
  findCommentsByArticle,
  findById,
  update,
  deleteId,
  findCommentsByProduct,
  commentArticle,
  commentProduct,
};
