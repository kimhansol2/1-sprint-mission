import prisma from '../lib/prisma';
import { Comment } from '@prisma/client';
import {
  ArticleCommnetCreateData,
  commnetupdatedata,
  ProductCommnetCreateData,
} from '../dto/commentDTO';
type Cursor = number | undefined;

export async function findCommentsByArticles(
  articleId: number,
  cursor: Cursor,
  limit: number,
): Promise<Comment[]> {
  return prisma.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findCommentsByProductData(
  productId: number,
  cursor: Cursor,
  limit: number,
): Promise<Comment[]> {
  return prisma.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit,
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id: number): Promise<Comment | null> {
  return prisma.comment.findUnique({ where: { id } });
}

export async function updatedata(commentData: commnetupdatedata): Promise<Comment> {
  const { id, content } = commentData;
  return prisma.comment.update({
    where: { id },
    data: { content },
  });
}

export async function deleteId(id: number): Promise<Comment> {
  return prisma.comment.delete({
    where: { id },
  });
}

export async function commentArticle(comment: ArticleCommnetCreateData): Promise<Comment> {
  const { content, articleId, userId } = comment;
  return await prisma.comment.create({
    data: {
      content,
      article: { connect: { id: articleId } },
      user: { connect: { id: userId } },
    },
  });
}

export async function commentProductData(productData: ProductCommnetCreateData) {
  const { content, productId, userId } = productData;
  return await prisma.comment.create({
    data: {
      content,
      product: { connect: { id: productId } },
      user: { connect: { id: userId } },
    },
  });
}
