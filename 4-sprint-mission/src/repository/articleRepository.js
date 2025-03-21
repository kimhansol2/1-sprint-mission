import prisma from "../lib/prisma.js";

async function save(data) {
  return prisma.article.create({
    data: {
      title: data.title,
      content: data.content,
      image: data.image,
    },
  });
}

async function findById(id) {
  return prisma.article.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
}

async function countArticle(keyword) {
  return await prisma.article.count({
    where: keyword ? { title: { contains: keyword } } : undefined,
  });
}

async function findArticle(page, pagesize, orderBy, keyword) {
  return prisma.article.findMany({
    skip: (page - 1) * pagesize,
    take: pagesize,
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    where: keyword ? { title: { contains: keyword } } : undefined,
  });
}

async function update(id, data) {
  return await prisma.article.update({ where: { id }, data });
}

async function deleteById(id) {
  return await prisma.article.delete({ where: { id } });
}

async function saveComment(articleId, content) {
  return await prisma.comment.create({
    data: {
      articleId,
      content,
    },
  });
}

export default {
  save,
  findById,
  countArticle,
  findArticle,
  update,
  deleteById,
  saveComment,
};
