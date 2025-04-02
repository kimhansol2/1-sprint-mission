import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from "../structs/productsStruct";
import {
  CreateCommentBodyStruct,
  getCommentListParamsStruct,
} from "../structs/commentsStruct";
import { IdParamsStruct } from "../structs/commonStruct";
import { create } from "superstruct";
import productService from "../services/productService";
import likeServices from "../services/likeServices";
import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../lib/errors/Unauthorized";
import {
  ProductCreateData,
  productResponseDTO,
  ProductUpdateData,
} from "../dto/productDTO";
import {
  ProductCommnetCreateData,
  productcommentResponseDTO,
} from "../dto/commentDTO";
import { createProductLike } from "../dto/likeDTO";

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const createProduct: Controller = async (req, res, next) => {
  try {
    const data = create(req.body, CreateProductBodyStruct);
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }
    const productData: ProductCreateData = {
      ...data,
      userId: user.id,
    };
    console.log("Creating product with data:", productData);
    const product = await productService.create(productData);

    res.status(201).json(productResponseDTO(product));
  } catch (error) {
    return next(error);
  }
};

export const getProductList: Controller = async (req, res, next) => {
  try {
    const { page, pagesize, orderBy, keyword } = create(
      req.query,
      GetProductListParamsStruct
    );
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }
    const finalKeyword = keyword || "";

    const totalCount = await productService.count(finalKeyword);

    const products = await productService.list(user.id, {
      page,
      pagesize,
      orderBy,
      keyword,
    });
    res.send({ list: products, totalCount });
    return;
  } catch (error) {
    return next(error);
  }
};

export const getProduct: Controller = async (req, res, next) => {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const product = await productService.getById(id);

    res.send(productResponseDTO(product));
    return;
  } catch (error) {
    return next(error);
  }
};

export const updateProduct: Controller = async (req, res, next) => {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const data = create(req.body, UpdateProductBodyStruct);
    await productService.getById(id);

    const productData: ProductUpdateData = {
      id,
      ...data,
    };
    const product = await productService.update(productData);
    res.send(productResponseDTO(product));
    return;
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

export const createComment: Controller = async (req, res, next) => {
  try {
    const { id: productId } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, CreateCommentBodyStruct);
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }
    const productComment: ProductCommnetCreateData = {
      productId,
      content,
      userId,
    };

    await productService.getById(productId);

    const comment = await productService.commentProduct(productComment);
    res.status(201).send(productcommentResponseDTO(comment));
    return;
  } catch (error) {
    return next(error);
  }
};

export const getCommentList: Controller = async (req, res, next) => {
  try {
    const { id: productId } = create(req.params, IdParamsStruct);
    const { cursor, limit } = create(req.query, getCommentListParamsStruct);

    await productService.getById(productId);
    const result = await productService.findCommentsByProduct(
      productId,
      cursor,
      limit
    );

    res.send({ result });
    return;
  } catch (error) {
    return next(error);
  }
};

export const productLike: Controller = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const productData: createProductLike = {
      userId,
      productId,
    };

    const like = await likeServices.likeProductFind(productData);
    res.status(200).json(like);
  } catch (error) {
    return next(error);
  }
};
