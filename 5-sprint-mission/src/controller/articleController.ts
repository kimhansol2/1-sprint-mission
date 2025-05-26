import { create } from 'superstruct';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articleStructs';
import { IdParamsStruct } from '../structs/commonStruct';
import { CreateCommentBodyStruct, getCommentListParamsStruct } from '../structs/commentsStruct';
import {
  save,
  getList,
  getById,
  update,
  deleteById,
  saveComment,
  findCommentsByArticle,
} from '../services/articleService';
import { likeArticleFind } from '../services/likeServices';
import express from 'express';
import UnauthorizedError from '../lib/errors/Unauthorized';
import { ArticleCreateData, articleResponseDTO, ArticleUpdateData } from '../dto/articleDTO';
import { ArticleCommnetCreateData, articlecommentResponseDTO } from '../dto/commentDTO';
import { createArticleLike } from '../dto/likeDTO';

type Controller = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>;

export const createArticle: Controller = async (req, res) => {
  const data = create(req.body, CreateArticleBodyStruct);

  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }
  const articleData: ArticleCreateData = {
    ...data,
    userId: req.user.id,
  };

  const article = await save(articleData);
  res.status(201).json(articleResponseDTO(article));
  return;
};

export const getArticleList: Controller = async (req, res) => {
  const params = create(req.query, GetArticleListParamsStruct);
  const userId = req.user?.id;

  if (!userId) {
    throw new UnauthorizedError('Unauthorized');
  }

  const article = await getList(userId, params);

  res.send(article);
};

export const getArticle: Controller = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const article = await getById(id);
  res.send(articleResponseDTO(article));
};

export const updateArticle: Controller = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const updateData: ArticleUpdateData = {
    ...data,
    id,
  };

  const article = await update(updateData);
  res.send(articleResponseDTO(article));
};

export const deleteArticle: Controller = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  await getById(id);
  await deleteById(id);
  res.status(204).send();
  return;
};

export const createComment: Controller = async (req, res, next) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const userId = req.user?.id;

  if (!userId) {
    throw new UnauthorizedError('Unauthorized');
  }

  await getById(articleId);

  const commentData: ArticleCommnetCreateData = {
    articleId,
    content,
    userId,
  };
  const comment = await saveComment(commentData);

  res.status(201).send(articlecommentResponseDTO(comment));
  return;
};

export const getCommentList: Controller = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, getCommentListParamsStruct);

  await getById(articleId);
  const result = await findCommentsByArticle(articleId, cursor, limit);
  res.send({ result });
  return;
};

export const articleLike: Controller = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new UnauthorizedError('Unauthorized');
  }
  const articleId = parseInt(req.params.id);

  const likeId: createArticleLike = {
    userId,
    articleId,
  };
  const like = await likeArticleFind(likeId);

  res.status(200).json(like);
};
