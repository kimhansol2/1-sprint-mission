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
} from "../controller/articleController";
import passport from "../middlewares/passport";
import { verifyarticleAuth } from "../middlewares/jwtAuth.js";

const articlesRouter = express.Router();

articlesRouter.post(
  "/",
  passport.authenticate("accessToken", { session: false }),
  asyncHandler(createArticle)
);
articlesRouter.get(
  "/",
  passport.authenticate("accessToken", { session: false }),
  asyncHandler(getArticleList)
);
articlesRouter.get("/:id", asyncHandler(getArticle));
articlesRouter.patch(
  "/:id",
  passport.authenticate("accessToken", { session: false }),
  verifyarticleAuth,
  asyncHandler(updateArticle)
);
articlesRouter.delete(
  "/:id",
  passport.authenticate("accessToken", { session: false }),
  verifyarticleAuth,
  asyncHandler(deleteArticle)
);
articlesRouter.post(
  "/:id/comments",
  passport.authenticate("accessToken", { session: false }),
  asyncHandler(createComment)
);
articlesRouter.get("/:id/comments", asyncHandler(getCommentList));
articlesRouter.post(
  "/:id/likes",
  passport.authenticate("accessToken", { session: false }),
  asyncHandler(articleLike)
);

export default articlesRouter;
