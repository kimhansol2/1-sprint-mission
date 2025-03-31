import { create } from "superstruct";
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
import articleService from "../services/articleService.js";
import likeServices from "../services/likeServices.js";
import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../lib/errors/Unauthorized.js";

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

interface User {
  id: number;
}

export const createArticle: Controller = async (req, res, next) => {
  try {
    const data = create(req.body, CreateArticleBodyStruct);
    console.log(data);

    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const user = req.user as User;
    const articleData = {
      ...data,
      userId: user.id,
    };
    console.log(articleData);
    const article = await articleService.create(articleData);
    res.status(201).send(article);
  } catch (error) {
    const err = error as Error;
    if (err.name === "StructError") {
      return res.status(400).json({ error: "Invalid article data" });
    }
    return next(error);
  }
};

export const getArticleList: Controller = async (req, res, next) => {
  try {
    const params = create(req.query, GetArticleListParamsStruct);
    const userId = req.user.id;
    const result = await articleService.getList(userId, params);

    res.send(result);
  } catch (error) {
    return next(error);
  }
};

export async function getArticle(req, res, next) {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const article = await articleService.getById(id);
    res.send(article);
  } catch (error) {
    return next(error);
  }
}

export async function updateArticle(req, res, next) {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const data = create(req.body, UpdateArticleBodyStruct);
    const article = await articleService.update(id, data);
    res.send(article);
  } catch (error) {
    return next(error);
  }
}

export async function deleteArticle(req, res) {
  try {
    const { id } = create(req.params, IdParamsStruct);
    await articleService.getById(id);
    await articleService.deleteById(id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export async function createComment(req, res, next) {
  try {
    const { id: articleId } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, CreateCommentBodyStruct);
    console.log(content);
    const user = req.user.id;
    await articleService.getById(articleId);
    const comment = await articleService.saveComment(articleId, content, user);

    return res.status(201).send(comment);
  } catch (error) {
    return next(error);
  }
}

export async function getCommentList(req, res, next) {
  try {
    const { id: articleId } = create(req.params, IdParamsStruct);
    const { cursor, limit } = create(req.query, getCommentListParamsStruct);

    await articleService.getById(articleId);
    const result = await articleService.findCommentsByArticle(
      articleId,
      cursor,
      limit
    );

    return res.send({ result });
  } catch (error) {
    return next(error);
  }
}

export async function articleLike(req, res, next) {
  try {
    const userId = req.user.id;
    const articleId = parseInt(req.params.id);
    const result = await likeServices.likeArticleFind(userId, articleId);

    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
