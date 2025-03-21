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
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
}

async function findById(id) {
  const existingComment = await prisma.comment.findUnique({ where: { id } });

  if (!existingComment) {
    throw new NotFoundError("comment", id);
  }

  return existingComment;
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

async function commentArticle(articleId, content) {
  return await prisma.comment.create({
    data: {
      articleId,
      content,
    },
  });
}

async function commentProduct(productId, content) {
  return await prisma.comment.create({
    data: {
      productId,
      content,
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
