import prisma from "../lib/prisma";

async function save(data) {
  return prisma.product.create({ data });
}

async function list(page, pagesize, orderBy, keyword) {
  return prisma.product.findMany({
    skip: (page - 1) * pagesize,
    take: pagesize,
    orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
    where: keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        }
      : undefined,
  });
}

async function count(keyword) {
  return prisma.product.count({
    where: keyword ? { title: { contains: keyword } } : undefined,
  });
}

async function getById(id) {
  return prisma.product.findUnique({
    where: { id },
    select: {
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
    },
  });
}

async function update(id, content) {
  return prisma.product.update({
    where: { id },
    data: { content },
  });
}

async function deleteId(id) {
  return prisma.product.delete({
    where: { id },
  });
}

export default {
  save,
  list,
  count,
  getById,
  update,
  deleteId,
};
