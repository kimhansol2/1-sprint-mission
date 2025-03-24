import prisma from "../lib/prisma.js";

async function save(data) {
  return prisma.article.create({ data });
}

async function findById(id) {
  return prisma.article.findUnique({ where: { id } });
}

async function countArticle(keyword) {
  return await prisma.article.count({
    where: keyword ? { title: { contains: keyword } } : undefined,
  });
}

async function findArticle(userId, page, pagesize, orderBy, keyword) {
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

async function update(id, data) {
  return await prisma.article.update({ where: { id }, data });
}

async function deleteById(id) {
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
