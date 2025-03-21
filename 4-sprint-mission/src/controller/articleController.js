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

export async function createArticle(req, res, next) {
  try {
    const data = create(req.body, CreateArticleBodyStruct);
    const article = await articleService.create(data);
    res.status(201).send(article);
  } catch (error) {
    if (error.name === "StructError") {
      return res.status(400).json({ error: "Invalid article data" });
    }
    return next(error);
  }
}

export async function getArticleList(req, res, next) {
  try {
    const params = create(req.query, GetArticleListParamsStruct);
    const result = await articleService.getList(params);

    res.send(result);
  } catch (error) {
    return next(error);
  }
}

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

    await articleService.getById(articleId);

    const comment = await articleService.saveComment(articleId, content);

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
