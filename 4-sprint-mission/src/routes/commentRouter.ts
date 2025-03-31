import express from "express";
import {
  updateComment,
  deleteComment,
} from "../controller/commentsController.js";
import { asyncHandler } from "../lib/async-handler.js";
import passport from "../middlewares/passport";
import { verifycommentAuth } from "../middlewares/jwtAuth.js";

const commentRouter = express.Router();

commentRouter.patch(
  "/:id",
  passport.authenticate("accessToken", { session: false }),
  verifycommentAuth,
  asyncHandler(updateComment)
);
commentRouter.delete(
  "/:id",
  passport.authenticate("accessToken", { session: false }),
  verifycommentAuth,
  asyncHandler(deleteComment)
);

export default commentRouter;
