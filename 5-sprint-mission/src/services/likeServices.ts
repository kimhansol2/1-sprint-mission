import {
  productLike,
  productLikeCancel,
  prouductLikeCreate,
  articleLike,
  articleLikeCancel,
  articleLikeCreate,
  findLikedProducts,
} from '../repository/likeRepository';
import { createArticleLike, createProductLike } from '../dto/likeDTO';

export async function likeProductFind(productData: createProductLike) {
  const existingLike = await productLike(productData);
  if (existingLike) {
    await productLikeCancel(productData);
    return { message: '좋아요가 취소되었습니다.' };
  } else {
    await prouductLikeCreate(productData);
    return { message: '좋아요가 추가되었습니다.' };
  }
}

export async function likeArticleFind(likeId: createArticleLike) {
  const existingLike = await articleLike(likeId);

  if (existingLike) {
    await articleLikeCancel(likeId);
    return { message: '좋아요가 취소되었습니다.' };
  } else {
    await articleLikeCreate(likeId);
    return { message: '좋아요가 추가되었습니다.' };
  }
}

export async function productLikedList(id: number, page: number, pagesize: number) {
  page = page > 0 ? page : 1;
  pagesize = pagesize > 1 ? pagesize : 10;
  return findLikedProducts(id, page, pagesize);
}
