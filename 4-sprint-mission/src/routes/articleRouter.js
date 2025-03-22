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
import passport from "../middlewares/passport.js";
import { verifyarticleAuth } from "../middlewares/jwtAuth.js";

const articlesRouter = express.Router();

articlesRouter.post(
  "/",
  passport.authenticate("accessToken", { session: false }),
  asyncHandler(createArticle)
);
articlesRouter.get("/", asyncHandler(getArticleList));
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
articlesRouter.post("/:id/comments", asyncHandler(createComment));
articlesRouter.get("/:id/comments", asyncHandler(getCommentList));

export default articlesRouter;
