import likeRepository from "../repository/likeRepository.js";

async function likeProductFind(userId, productId) {
  const existingLike = await likeRepository.like(userId, productId);
  if (existingLike) {
    await likeRepository.likeCancel(userId, productId);
    return { message: "좋아요가 취소되었습니다." };
  } else {
    await likeRepository.likeCreate(userId, productId);
    return { message: "좋아요가 추가되었습니다." };
  }
}

export default {
  likeProductFind,
};
