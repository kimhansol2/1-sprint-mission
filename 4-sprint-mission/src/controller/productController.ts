import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from "../structs/productsStruct.js";
import {
  CreateCommentBodyStruct,
  getCommentListParamsStruct,
} from "../structs/commentsStruct.js";
import { IdParamsStruct } from "../structs/commonStruct.js";
import { create } from "superstruct";
import productService from "../services/productService.js";
import likeServices from "../services/likeServices.js";
import { Request, Response, NextFunction } from "express";

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

export const createProduct: Controller = async (req, res, next) => {
  try {
    const data = create(req.body, CreateProductBodyStruct);
    const user = req.user;
    const productData = {
      ...data,
      userId: user.id,
    };
    console.log("Creating product with data:", productData);
    const product = await productService.create(productData);

    res.status(201).json({ message: product });
  } catch (error) {
    return next(error);
  }
};

export const getProductList: Controller = async (req, res, next) => {
  try {
    const { page, pageSize, orderBy, keyword } = create(
      req.query,
      GetProductListParamsStruct
    );
    const totalCount = await productService.count(keyword);
    const products = await productService.list(
      page,
      pageSize,
      orderBy,
      keyword
    );
    return res.send({ list: products, totalCount });
  } catch (error) {
    return next(error);
  }
};

export const getProduct: Controller = async (req, res, next) => {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const product = await productService.getById(id);

    return res.send(product);
  } catch (error) {
    return next(error);
  }
};

export const updateProduct: Controller = async (req, res, next) => {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const { name, description, price, tags, images } = create(
      req.body,
      UpdateProductBodyStruct
    );
    await productService.getById(id);
    const product = await productService.update(id, {
      name,
      description,
      price,
      tags,
      images,
    });
    return res.send(product);
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct: Controller = async (req, res, next) => {
  try {
    const { id } = create(req.params, IdParamsStruct);
    await productService.getById(id);
    await productService.deleteId(id);
    res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const createComment(req, res, next) {
  try {
    const { id: productId } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, CreateCommentBodyStruct);
    const user = req.user.id;
    await productService.getById(productId);

    const comment = await productService.commentProduct(
      productId,
      content,
      user
    );

    return res.status(201).send(comment);
  } catch (error) {
    return next(error);
  }
}

export async function getCommentList(req, res, next) {
  try {
    const { id: productId } = create(req.params, IdParamsStruct);
    const { cursor, limit } = create(req.query, getCommentListParamsStruct);

    await productService.getById(productId);
    const result = await productService.findCommentsByProduct(
      productId,
      cursor,
      limit
    );

    return res.send({ result });
  } catch (error) {
    return next(error);
  }
}

export async function productLike(req, res, next) {
  try {
    const productId = parseInt(req.params.id);
    const userId = req.user.id;
    const result = await likeServices.likeProductFind(userId, productId);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
