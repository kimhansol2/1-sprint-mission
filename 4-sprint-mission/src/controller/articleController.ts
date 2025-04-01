import { create } from "superstruct";
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from "../structs/articleStructs";
import { IdParamsStruct } from "../structs/commonStruct";
import {
  CreateCommentBodyStruct,
  getCommentListParamsStruct,
} from "../structs/commentsStruct";
import articleService from "../services/articleService";
import likeServices from "../services/likeServices";
import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../lib/errors/Unauthorized";
import { ArticleUpdateDate } from "../types/articleTypes.js";

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const createArticle: Controller = async (req, res, next) => {
  try {
    const data = create(req.body, CreateArticleBodyStruct);
    console.log(data);

    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }
    const articleData = {
      ...data,
      userId: req.user.id,
    };
    console.log(articleData);
    const article = await articleService.create(articleData);
    void res.status(201).json(article);
    return;
  } catch (error) {
    const err = error as Error;
    if (err.name === "StructError") {
      void res.status(400).json({ error: "Invalid article data" });
      return;
    }
    next(error);
  }
};

export const getArticleList: Controller = async (req, res, next) => {
  try {
    const params = create(req.query, GetArticleListParamsStruct);
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const result = await articleService.getList(userId, params);

    res.send(result);
  } catch (error) {
    return next(error);
  }
};

export const getArticle: Controller = async (req, res, next) => {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const article = await articleService.getById(id);
    res.send(article);
  } catch (error) {
    return next(error);
  }
};

export const updateArticle: Controller = async (req, res, next) => {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const data: ArticleUpdateDate = create(req.body, UpdateArticleBodyStruct);
    const article = await articleService.update(id, data);
    res.send(article);
  } catch (error) {
    return next(error);
  }
};

export const deleteArticle: Controller = async (req, res, next) => {
  try {
    const { id } = create(req.params, IdParamsStruct);
    await articleService.getById(id);
    await articleService.deleteById(id);
    res.status(204).send();
    return;
  } catch (error) {
    return next(error);
  }
};

export const createComment: Controller = async (req, res, next) => {
  try {
    const { id: articleId } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, CreateCommentBodyStruct);
    console.log(content);
    const user = req.user?.id;

    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    await articleService.getById(articleId);
    const comment = await articleService.saveComment(articleId, content, user);

    res.status(201).send(comment);
    return;
  } catch (error) {
    return next(error);
  }
};

export const getCommentList: Controller = async (req, res, next) => {
  try {
    const { id: articleId } = create(req.params, IdParamsStruct);
    const { cursor, limit } = create(req.query, getCommentListParamsStruct);

    await articleService.getById(articleId);
    const result = await articleService.findCommentsByArticle(
      articleId,
      cursor,
      limit
    );
    res.send({ result });
    return;
  } catch (error) {
    return next(error);
  }
};

export const articleLike: Controller = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }
    const articleId = parseInt(req.params.id);
    const result = await likeServices.likeArticleFind({ userId, articleId });

    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
