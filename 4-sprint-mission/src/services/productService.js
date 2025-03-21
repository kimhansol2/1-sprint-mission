import productRepository from "../repository/productRepository";
import NotFoundError from "../lib/errors/NotFoundError";
import commentsRepository from "../repository/commentsRepository";

async function create(data) {
  return productRepository.save(data);
}

async function list(page, pagesize, orderBy, keyword) {
  return productRepository.list(page, pagesize, orderBy, keyword);
}

async function count(keyword) {
  return productRepository.count(keyword);
}

async function getById(id) {
  product = await productRepository.getById(id);
  if (!product) {
    throw new NotFoundError("product", id);
  }
  return product;
}

async function update(id, content) {
  return productRepository.update(id, content);
}

async function deleteId(id) {
  return productRepository.deleteId(id);
}

async function commentProduct(productId, content) {
  return commentsRepository.commentProduct(productId, content);
}

async function findCommentsByProduct(productId, cursor, limit) {
  const commentsWithCursor = await commentsRepository.findCommentsByProduct(
    productId,
    cursor,
    limit + 1
  );

  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return {
    list: comments,
    nextCursor,
  };
}

export default {
  create,
  list,
  count,
  getById,
  update,
  deleteId,
  commentProduct,
  findCommentsByProduct,
};
