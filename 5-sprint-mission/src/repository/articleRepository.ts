import prisma from "../lib/prisma";
import { Prisma, Article } from "@prisma/client";
import { ArticleUpdateData } from "../dto/articleDTO";

type ArticleCreateDat = Prisma.ArticleCreateInput;
type ArticleWithLike = Article & { ArticleLike: { isLiked: boolean }[] };
async function save(data: ArticleCreateDat): Promise<Article> {
  return prisma.article.create({ data });
}

async function findById(id: number): Promise<Article | null> {
  return prisma.article.findUnique({ where: { id } });
}

async function countArticle(keyword?: string): Promise<number> {
  return await prisma.article.count({
    where: keyword ? { title: { contains: keyword } } : undefined,
  });
}

async function findArticle(
  userId: number,
  page: number,
  pagesize: number,
  orderBy: string,
  keyword?: string
): Promise<ArticleWithLike[]> {
  return prisma.article.findMany({
    skip: (page - 1) * pagesize,
    take: pagesize,
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    where: keyword ? { title: { contains: keyword } } : undefined,
    include: {
      ArticleLike: {
        where: { userId: userId },
        select: { isLiked: true },
      },
    },
  });
}

async function update(updateData: ArticleUpdateData): Promise<Article> {
  const { id, ...data } = updateData;
  return await prisma.article.update({ where: { id }, data });
}

async function deleteById(id: number): Promise<Article> {
  return await prisma.article.delete({ where: { id } });
}

export default {
  save,
  findById,
  countArticle,
  findArticle,
  update,
  deleteById,
};
