import productRepository from "../repository/productRepository.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import commentsRepository from "../repository/commentsRepository.js";

async function create(data) {
  const user = await productRepository.save(data);
  if (user) {
    console.error("이미 있음");
  }
  return user;
}

async function list(page, pagesize, orderBy, keyword) {
  page = page > 0 ? page : 1;
  pagesize = pagesize > 0 ? pagesize : 10;
  return productRepository.list(page, pagesize, orderBy, keyword);
}

async function count(keyword) {
  return productRepository.count(keyword);
}

async function getById(id) {
  const existingProduct = await productRepository.getById(id);
  if (!existingProduct) {
    throw new NotFoundError("product", id);
  }
  return existingProduct;
}

async function update(id, { name, description, price, tags, images }) {
  return productRepository.update(id, {
    name,
    description,
    price,
    tags,
    images,
  });
}

async function deleteId(id) {
  return productRepository.deleteId(id);
}

async function commentProduct(productId, content, user) {
  return commentsRepository.commentProduct(productId, content, user);
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
