import { Comment as PrismaComment } from "@prisma/client";

export interface Comment extends PrismaComment {}

export function articlecommentResponseDTO(comment: Comment) {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    articleId: comment.articleId,
    userId: comment.userId,
  };
}

export function commentResponseDTO(comment: Comment) {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    articleId: comment.articleId,
    productId: comment.productId,
    userId: comment.userId,
  };
}

export function productcommentResponseDTO(comment: Comment) {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    productId: comment.productId,
    userId: comment.userId,
  };
}

export interface ArticleCommnetCreateData {
  content: string;
  articleId: number;
  userId: number;
}

export interface ProductCommnetCreateData {
  content: string;
  productId: number;
  userId: number;
}

export interface commnetupdatedata {
  id: number;
  content: string;
}
