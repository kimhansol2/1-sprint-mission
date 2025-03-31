import prisma from "../lib/prisma.js";
import { Product, Prisma, Article, ProductLike } from "@prisma/client";
import { UpdateCommentBody } from "../structs/commentsStruct.js";

type ProductCreateDat = Prisma.ProductCreateInput;
type ProductUpdateDat = Prisma.ProductUpdateInput;
type ProductWithLike = Product & { ProductLike: { isLiked: boolean }[] };

async function save(data: ProductCreateDat): Promise<Product> {
  console.log("Saving product with data:", data);
  return prisma.product.create({ data });
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

async function update(
  id: number,
  { name, description, price, tags, images }: ProductUpdateDat
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
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
