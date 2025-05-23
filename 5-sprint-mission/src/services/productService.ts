import {
  updateData,
  countdata,
  savedata,
  listdata,
  getByIdData,
  deleteIdData,
} from '../repository/productRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { findCommentsByProductData, commentProductData } from '../repository/commentsRepository';
import { ProductCreateData, ProductUpdateData } from '../dto/productDTO';
import { ProductCommnetCreateData } from '../dto/commentDTO';
import { ListQueryParams } from '../types/queryParams';
import { notifyPriceChanged } from './notificationService';

export async function save(productData: ProductCreateData) {
  const product = await savedata(productData);
  if (!product) {
    throw new Error('product 생성 실패');
  }
  return product;
}

export async function list(userId: number | null, params: ListQueryParams) {
  const adjustedParams = {
    ...params,
    userId: userId ?? undefined,
    page: params.page > 0 ? params.page : 1,
    pagesize: params.pagesize > 0 ? params.pagesize : 10,
  };

  const totalCount = await countdata(
    adjustedParams.keyword,
    adjustedParams.likedOnly,
    adjustedParams.userId,
  );

  const products = await listdata(adjustedParams);
  return {
    list: products.map((product) => {
      return {
        ...product,
        isLiked: userId ? product.ProductLike.length > 0 : false,
        ProductLike: undefined,
      };
    }),
    totalCount,
  };
}

export async function count(keyword: string) {
  return countdata(keyword);
}

export async function getById(id: number) {
  const existingProduct = await getByIdData(id);
  if (!existingProduct) {
    throw new NotFoundError('NotFound');
  }
  return existingProduct;
}

export async function update(productData: ProductUpdateData) {
  const existing = await getByIdData(productData.id);
  const updated = await updateData(productData);

  if (
    existing?.price !== undefined &&
    productData.price !== undefined &&
    existing.price !== productData.price
  ) {
    await notifyPriceChanged(updated.id, updated.price);
  }
  return updated;
}

export async function deleteId(id: number) {
  return deleteIdData(id);
}

export async function commentProduct(productComment: ProductCommnetCreateData) {
  return commentProductData(productComment);
}

export async function findCommentsByProduct(productId: number, cursor: number, limit: number) {
  const commentsWithCursor = await findCommentsByProductData(productId, cursor, limit + 1);

  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return {
    list: comments,
    nextCursor,
  };
}
