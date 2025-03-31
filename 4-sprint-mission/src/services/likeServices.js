import articleRepository from "../repository/articleRepository.js";
import likeRepository from "../repository/likeRepository.js";

async function likeProductFind(userId, productId) {
  const existingLike = await likeRepository.productLike(userId, productId);
  if (existingLike) {
    await likeRepository.productLikeCancel(userId, productId);
    return { message: "좋아요가 취소되었습니다." };
  } else {
    await likeRepository.prouductLikeCreate(userId, productId, true);
    return { message: "좋아요가 추가되었습니다." };
  }
}

async function likeArticleFind(userId, articleId) {
  const existingLike = await likeRepository.articleLike(userId, articleId);

  if (existingLike) {
    await likeRepository.articleLikeCancel(userId, articleId);
    return { message: "좋아요가 취소되었습니다." };
  } else {
    await likeRepository.articleLikeCreate(userId, articleId, true);
    return { message: "좋아요가 추가되었습니다." };
  }
}

async function productLikedList(id, page, pagesize) {
  page = page > 0 ? page : 1;
  pagesize = pagesize > 1 ? pagesize : 10;
  return likeRepository.findLikedProducts(id, page, pagesize);
}

export default {
  likeProductFind,
  likeArticleFind,
  productLikedList,
};
