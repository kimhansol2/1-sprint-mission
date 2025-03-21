import express from "express";
import { asyncHandler } from "../lib/async-handler.js";
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
} from "../controller/articleController.js";

const articlesRouter = express.Router();

articlesRouter.post("/", asyncHandler(createArticle));
articlesRouter.get("/", asyncHandler(getArticleList));
articlesRouter.get("/:id", asyncHandler(getArticle));
articlesRouter.patch("/:id", asyncHandler(updateArticle));
articlesRouter.delete("/:id", asyncHandler(deleteArticle));
articlesRouter.post("/:id/comments", asyncHandler(createComment));
articlesRouter.get("/:id/comments", asyncHandler(getCommentList));

export default articlesRouter;
