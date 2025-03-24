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
  articleLike,
} from "../controller/articleController.js";
import Auth from "../middlewares/Auth.js";

const articlesRouter = express.Router();

articlesRouter.post("/", Auth.verifySessionLogin, asyncHandler(createArticle));
articlesRouter.get("/", asyncHandler(getArticleList));
articlesRouter.get("/:id", asyncHandler(getArticle));
articlesRouter.patch(
  "/:id",
  Auth.verifySessionLogin,
  Auth.verifyArticleAuth,
  asyncHandler(updateArticle)
);
articlesRouter.delete(
  "/:id",
  Auth.verifySessionLogin,
  Auth.verifyArticleAuth,
  asyncHandler(deleteArticle)
);
articlesRouter.post("/:id/comments", asyncHandler(createComment));
articlesRouter.get("/:id/comments", asyncHandler(getCommentList));
articlesRouter.post("/:id/likes", asyncHandler(articleLike));

export default articlesRouter;
