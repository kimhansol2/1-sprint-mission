import prisma from "../lib/prisma.js";

async function save(data) {
  console.log("Saving product with data:", data);
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
  });
}

async function update(id, { name, description, price, tags, images }) {
  return prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      tags: { set: tags },
      images: { set: images },
    },
  });
}

async function deleteId(id) {
  return prisma.product.delete({
    where: { id },
  });
}

async function userProduct(id, { page, pagesize, orderBy }) {
  return prisma.product.findMany({
    where: { userId: id },
    skip: (page - 1) * pagesize,
    take: pagesize,
    orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
  });
}

export default {
  save,
  list,
  count,
  getById,
  update,
  deleteId,
  userProduct,
};
