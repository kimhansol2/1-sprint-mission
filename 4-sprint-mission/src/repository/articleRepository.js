import prisma from "../lib/prisma.js";

async function createArticle(data) {
  return prisma.article.create({
    data: {
      title: data.title,
      content: data.content,
    },
  });
}

async function findById(id) {
  return prisma.article.findUnique({
    where: {
      id,
    },
  });
}

export default {
  createArticle,
};
