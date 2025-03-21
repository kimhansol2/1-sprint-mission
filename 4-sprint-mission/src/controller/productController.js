import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from "../structs/prodcutsStruct.js";
import { IdParamsStruct } from "../structs/commonStruct";
import { create } from "superstruct";
import productService from "../services/productService.js";

export async function createProduct(req, res, error) {
  try {
    const data = create(req.body, CreateProductBodyStruct);
    const product = await productService.create(data);

    res.status(201).json({ message: product });
  } catch (error) {
    next(error);
  }
}

export async function getProductList(req, res, next) {
  try {
    const { page, pagesize, orderBy, keyword } = create(
      req.query,
      GetProductListParamsStruct
    );
    totalCount = await productService.count(keyword);
    products = await productService.list(page, pagesize, orderBy, keyword);
    return res.send({ list: products, totalCount });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { id } = create(req.params, IdParamsStruct);
    product = productService.getById(id);

    return res.send(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, UpdateProductBodyStruct);
    await productService.getById(id);
    product = await productService.update(id, content);
    return res.send(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = create(req.params, IdParamsStruct);
    await productService.getById(id);
    await productService.deleteId(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function createComment(req, res, next) {
  try {
    const { id: productId } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, CreateCommentBodyStruct);

    await productService.getById(productId);

    const comment = await productService.commentProduct(productId, content);

    return res.status(201).send(comment);
  } catch (error) {
    next(error);
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
    next(error);
  }
}
