import prisma from '../lib/prisma';
import { Article } from '@prisma/client';
import { ArticleUpdateData } from '../dto/articleDTO';
import { ArticleCreateData } from '../dto/articleDTO';

type ArticleWithLike = Article & { ArticleLike: { userId: number }[] };

export async function savedata(data: ArticleCreateData): Promise<Article> {
  const { userId, ...rest } = data;
  return prisma.article.create({
    data: {
      ...rest,
      user: { connect: { id: userId } },
    },
  });
}

export async function findById(id: number): Promise<Article | null> {
  return prisma.article.findUnique({ where: { id } });
}

export async function countArticle(keyword?: string): Promise<number> {
  return await prisma.article.count({
    where: keyword ? { title: { contains: keyword } } : undefined,
  });
}

export async function findArticle(
  page: number,
  pagesize: number,
  orderBy: string,
  keyword?: string,
): Promise<ArticleWithLike[]> {
  return prisma.article.findMany({
    skip: (page - 1) * pagesize,
    take: pagesize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where: keyword ? { title: { contains: keyword } } : undefined,
    include: {
      ArticleLike: {
        select: { userId: true },
      },
    },
  });
}

export async function updatedata(updateData: ArticleUpdateData): Promise<Article> {
  const { id, ...data } = updateData;
  return await prisma.article.update({ where: { id }, data });
}

export async function deleteByIdData(id: number): Promise<Article> {
  return await prisma.article.delete({ where: { id } });
}

export async function findArticleAuthorId(id: number): Promise<number | null> {
  const article = await prisma.article.findUnique({
    where: { id },
    select: { userId: true },
  });

  return article?.userId ?? null;
}
