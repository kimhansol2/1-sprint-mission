import { create } from "superstruct";
import { prisma } from "../lib/prisma.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from "../structs/articleStructs.js";
import { IdParamsStruct } from "../structs/commonStruct.js";
import {
  CreateCommentBodyStruct,
  getCommentListParamsStruct,
} from "../structs/commentsStruct.js";

const articleRouter = express.Router();

export async function createArticle(req, res) {
  const data = create(req.body, CreateArticleBodyStruct);
  const article = await prisma.article.create({ data });
  res.status(201).send(article);
}

export async function getArticleList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetArticleListParamsStruct
  );
  const where = {
    title: keyword ? { contain: keyword } : undefined,
  };
  const totalCount = await prisma.article.count({ where });
  const articles = await prisma.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    where,
  });

  return res.send({
    list: articles,
    totalCount,
  });
}

export async function getArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
  res.send(article);
}

export async function updateArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const article = await prisma.article.update({ where: { id }, data });
  res.send(article);
}

export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingArticle = await prisma.article.findUnique({ where: { id } });

  if (!existingArticle) {
    throw new NotFoundError("article", id);
  }

  await prisma.article.delete({
    where: { id },
  });
  return res.status(204).send();
}

export async function createComment(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingArticle = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!existingArticle) {
    throw new NotFoundError("article", articleId);
  }

  const comment = await prisma.comment.create({
    data: {
      articleId,
      content,
    },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, getCommentListParamsStruct);

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new NotFoundError("article", articleId);
  }

  const commentsWithCursor = await PrismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}
