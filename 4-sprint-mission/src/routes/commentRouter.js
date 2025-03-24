import express from "express";
import {
  updateComment,
  deleteComment,
} from "../controller/commentsController.js";
import { asyncHandler } from "../lib/async-handler.js";

const commentRouter = express.Router();

commentRouter.patch("/:id", asyncHandler(updateComment));
commentRouter.delete("/:id", asyncHandler(deleteComment));

export default commentRouter;
