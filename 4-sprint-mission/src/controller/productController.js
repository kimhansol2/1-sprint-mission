import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from "../structs/prodcutsStruct.js";
import prisma from "../lib/prisma";
import { IdParamsStruct } from "../structs/commonStruct";
import { create } from "superstruct";
import NotFoundError from "../lib/errors/NotFoundError";

//productRouter.route("/").post(asyncHandler(async
export async function createProduct(req, res) {
  const data = create(req.body, CreateProductBodyStruct);
  const product = await prisma.product.create({ data });

  res.status(201).json({ message: product });
}

//.get(async
export async function getProductList(req, res) {
  const { page, pagesize, orderBy, keyword } = create(
    req.query,
    GetProductListParamsStruct
  );

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : undefined;

  const totalCount = await prisma.product.count({ where });
  const products = await prisma.product.findMany({
    skip: (page - 1) * pagesize,
    take: pagesize,
    orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
    where,
  });

  return res.send({ list: products, totalCount });
}

//productRouter.route("/:id").get(asyncHandler(
export async function getProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
    },
  });
  if (!product) {
    throw new NotFoundError("product", id);
  }

  return res.send(product);
}

//.patch(asyncHandler(
export async function updateProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateProductBodyStruct);
  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    throw new NotFoundError("product", id);
  }
  const product = await prisma.product.update({
    where: { id },
    data: { content },
  });
  return res.send(product);
}

//.delete(async
export async function deleteProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const existingProduct = await prisma.product.findUnique({ where: id });
  if (!existingProduct) {
    throw new NotFoundError("product", id);
  }

  await prisma.product.delete({
    where: { id },
  });
  res.status(204).send();
}

export default productRouter;
