import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { CreateCommentBodyStruct, getCommentListParamsStruct } from '../structs/commentsStruct';
import { IdParamsStruct } from '../structs/commonStruct';
import { create } from 'superstruct';
import {
  save,
  list,
  getById,
  update,
  deleteId,
  commentProduct,
  findCommentsByProduct,
} from '../services/productService';
import { likeProductFind } from '../services/likeServices';
import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../lib/errors/Unauthorized';
import { ProductCreateData, productResponseDTO, ProductUpdateData } from '../dto/productDTO';
import { ProductCommnetCreateData, productcommentResponseDTO } from '../dto/commentDTO';
import { createProductLike } from '../dto/likeDTO';
import { ListQueryParams } from '../types/queryParams';

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const createProduct: Controller = async (req, res) => {
  const data = create(req.body, CreateProductBodyStruct);
  const user = req.user;

  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }
  const productData: ProductCreateData = {
    ...data,
    userId: user.id,
  };

  const product = await save(productData);

  res.status(201).json(productResponseDTO(product));
  return;
};

export const getProductList: Controller = async (req, res) => {
  const user = req.user ?? null;
  const queryParams = create(req.query, GetProductListParamsStruct) as ListQueryParams;
  if (!user && queryParams.likedOnly) {
    throw new UnauthorizedError('Unauthorized');
  }

  const userId = user ? user.id : null;

  const listParams: ListQueryParams = {
    ...queryParams,
    orderBy: queryParams.orderBy ?? 'recent',
    keyword: queryParams.keyword || '',
  };

  const result = await list(userId, listParams);
  res.send(result);
  return;
};

export const getProduct: Controller = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const product = await getById(id);

  res.send(productResponseDTO(product));
  return;
};

export const updateProduct: Controller = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);
  await getById(id);

  const productData: ProductUpdateData = {
    id,
    ...data,
  };
  const product = await update(productData);
  res.send(productResponseDTO(product));
  return;
};

export const deleteProduct: Controller = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  await getById(id);
  await deleteId(id);
  res.status(204).send();
};

export const createComment: Controller = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const userId = req.user?.id;

  if (!userId) {
    throw new UnauthorizedError('Unauthorized');
  }
  const productComment: ProductCommnetCreateData = {
    productId,
    content,
    userId,
  };

  await getById(productId);

  const comment = await commentProduct(productComment);
  res.status(201).send(productcommentResponseDTO(comment));
  return;
};

export const getCommentList: Controller = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, getCommentListParamsStruct);

  await getById(productId);
  const result = await findCommentsByProduct(productId, cursor, limit);

  res.send({ result });
  return;
};

export const productLike: Controller = async (req, res) => {
  const productId = parseInt(req.params.id);

  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const userId = req.user.id;

  const productData: createProductLike = {
    userId,
    productId,
  };

  const like = await likeProductFind(productData);
  res.status(200).json(like);
};
