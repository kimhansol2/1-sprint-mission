import prisma from "../lib/prisma.js";
import { Product, Prisma } from "@prisma/client";
import { ProductCreateData, ProductUpdateData } from "../dto/productDTO.js";

type ProductWithLike = Product & { ProductLike: { isLiked: boolean }[] };

async function save(productData: ProductCreateData): Promise<Product> {
  console.log("Saving product with data:", productData);
  return prisma.product.create({ data: productData });
}

async function list(
  userId: number,
  page: number,
  pagesize: number,
  orderBy: "recent" | "id",
  keyword?: string
): Promise<ProductWithLike[]> {
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
    include: {
      ProductLike: {
        where: { userId: userId },
        select: { isLiked: true },
      },
    },
  });
}

async function count(keyword?: string): Promise<number> {
  return prisma.product.count({
    where: keyword ? { name: { contains: keyword } } : undefined,
  });
}

async function getById(id: number): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id },
  });
}

async function update(productData: ProductUpdateData): Promise<Product> {
  const { id, tags, images, ...data } = productData;
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      tags: tags ? { set: tags as string[] } : undefined,
      images: images ? { set: images as string[] } : undefined,
    },
  });
}

async function deleteId(id: number): Promise<Product> {
  return prisma.product.delete({
    where: { id },
  });
}

async function userProduct(
  id: number,
  {
    page,
    pagesize,
    orderBy,
  }: { page: number; pagesize: number; orderBy: "recent" | "id" }
) {
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
