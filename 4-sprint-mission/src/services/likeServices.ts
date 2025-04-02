import likeRepository from "../repository/likeRepository";
import { createArticleLike, createProductLike } from "../dto/likeDTO";

async function likeProductFind(productData: createProductLike) {
  const existingLike = await likeRepository.productLike(productData);
  if (existingLike) {
    await likeRepository.productLikeCancel(productData);
    return { message: "좋아요가 취소되었습니다." };
  } else {
    await likeRepository.prouductLikeCreate(productData, true);
    return { message: "좋아요가 추가되었습니다." };
  }
}

async function likeArticleFind(likeId: createArticleLike) {
  const existingLike = await likeRepository.articleLike(likeId);

  if (existingLike) {
    await likeRepository.articleLikeCancel(likeId);
    return { message: "좋아요가 취소되었습니다." };
  } else {
    await likeRepository.articleLikeCreate(likeId, true);
    return { message: "좋아요가 추가되었습니다." };
  }
}

async function productLikedList(id: number, page: number, pagesize: number) {
  page = page > 0 ? page : 1;
  pagesize = pagesize > 1 ? pagesize : 10;
  return likeRepository.findLikedProducts(id, page, pagesize);
}

export default {
  likeProductFind,
  likeArticleFind,
  productLikedList,
};
