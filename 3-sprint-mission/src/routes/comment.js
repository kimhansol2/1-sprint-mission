import { PrismaClient } from "@prisma/client";
import express from "express";
import { assert } from "superstruct";
import { CreateComment, PatchComment } from "../structs.js";
import asyncHandler from "../middlewares/async-handler.js";

const prisma = new PrismaClient();
const commentRouter = express.Router();
//const articleCommentRouter = express.Router();

commentRouter
  .route("/")
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateComment);
      const { productId, articleId, content } = req.body;

      const data = { content };
      if (productId) {
        data.product = { connect: { id: productId } };
      } else if (articleId) {
        data.article = { connect: { id: articleId } };
      }
      const comment = await prisma.comment.create({
        data,
      });
      res.status(201).send(comment);
    })
  )
  .get(
    asyncHandler(async (req, res) => {
      const { productId, cursor = 0, limit = 2 } = req.query;
      const parsedLimit = parseInt(limit);
      const parseCursor = parseInt(cursor);

      const comments = await prisma.comment.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
        skip: parseCursor * parsedLimit,
        take: parsedLimit,
      });

      const nextCursor =
        comments.length === parsedLimit ? parseCursor + 1 : null;

      res.send({ comments, nextCursor });
    })
  )
  .get(
    asyncHandler(async (req, res) => {
      const { articleId, cursor = 0, limit = 2 } = req.query;
      const parsedLimit = parseInt(limit);
      const parseCursor = parseInt(cursor);

      const comments = await prisma.comment.findMany({
        where: { articleId },
        orderBy: { createdAt: "desc" },
        skip: parseCursor * parsedLimit,
        take: parsedLimit,
      });

      const nextCursor =
        comments.length === parsedLimit ? parseCursor + 1 : null;

      res.send({ comments, nextCursor });
    })
  );

commentRouter
  .route("/:id")
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchComment);
      const { id } = req.params;
      const comment = await prisma.comment.update({
        where: { id },
        data: req.body,
      });
      res.send(comment);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const comment = await prisma.comment.delete({
        where: { id },
      });
    })
  );

export default commentRouter;
