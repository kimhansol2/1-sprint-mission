import express from "express";
import { assert } from "superstruct";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../middlewares/async-handler.js";
import { CreateArticle, PatchArticle } from "../structs.js";

const prisma = new PrismaClient();
const articleRouter = express.Router();

articleRouter
  .route("/")
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateArticle);
      const article = await prisma.article.create({ data: req.body });
      res.status(201).send(article);
    })
  )

  .get(
    asyncHandler(async (req, res) => {
      const { offset, limit, create = "recent", title, content } = req.query;
      let orderBy;
      switch (create) {
        case "old":
          orderBy = { createdAt: "asc" };
          break;
        case "recent":
          orderBy = { createdAt: "desc" };
          break;
        default:
          orderBy = { createdAt: "desc" };
      }
      const where = {};
      if (title) {
        where.title = {
          contains: decodeURIComponent(title),
          mode: "insensitive",
        };
      }
      if (content) {
        where.content = {
          contains: decodeURIComponent(content),
          mode: "insensitive",
        };
      }
      const article = await prisma.article.findMany({
        where,
        orderBy,
        skip: parseInt(offset) || 0,
        take: parseInt(limit) || 10,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });
      res.send(article);
    })
  );

articleRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await prisma.article.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });
      res.send(article);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchArticle);
      const { id } = req.params;
      const article = await prisma.article.update({
        where: { id },
        data: req.body,
      });
      res.send(article);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await prisma.article.delete({
        where: { id },
      });
      res.send(article);
    })
  );

export default articleRouter;
