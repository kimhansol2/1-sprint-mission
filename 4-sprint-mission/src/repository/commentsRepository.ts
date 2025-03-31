import prisma from "../lib/prisma.js";
import { Comment } from "@prisma/client";

type Cursor = number | undefined;

async function findCommentsByArticle(
  articleId: number,
  cursor: Cursor,
  limit: number
): Promise<Comment[]> {
  return prisma.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit,
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
}

async function findCommentsByProduct(
  productId: number,
  cursor: Cursor,
  limit: number
): Promise<Comment[]> {
  return prisma.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit,
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
}

async function findById(id: number): Promise<Comment | null> {
  return prisma.comment.findUnique({ where: { id } });
}

async function update(id: number, content: string): Promise<Comment> {
  return prisma.comment.update({
    where: { id },
    data: { content },
  });
}

async function deleteId(id: number): Promise<Comment> {
  return prisma.comment.delete({
    where: { id },
  });
}

async function commentArticle(
  articleId: number,
  content: string,
  user: number
): Promise<Comment> {
  return await prisma.comment.create({
    data: {
      content,
      article: { connect: { id: articleId } },
      user: { connect: { id: user } },
    },
  });
}

async function commentProduct(
  productId: number,
  content: string,
  user: number
) {
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
