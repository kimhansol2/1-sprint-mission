import productRepository from "../repository/productRepository.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import commentsRepository from "../repository/commentsRepository.js";
import { ProductCreateData, ProductUpdateData } from "../types/productTypes.js";

interface GetListParams {
  page: number;
  pagesize: number;
  orderBy?: "recent" | "id";
  keyword?: string;
}

async function create(data: ProductCreateData) {
  const user = await productRepository.save(data);
  if (user) {
    console.error("이미 있음");
  }
  return user;
}

async function list(
  userId: number,
  { page, pagesize, orderBy, keyword }: GetListParams
) {
  const totalCount = await productRepository.count(keyword);
  page = page > 0 ? page : 1;
  pagesize = pagesize > 0 ? pagesize : 10;
  const products = await productRepository.list(
    userId,
    page,
    pagesize,
    (orderBy = "recent"),
    keyword
  );
  return {
    list: products.map((product) => ({
      ...product,
      isLiked:
        product.ProductLike.length > 0 ? product.ProductLike[0].isLiked : false,
      ProductLike: undefined,
    })),
    totalCount,
  };
}

async function count(keyword: string) {
  return productRepository.count(keyword);
}

async function getById(id: number) {
  const existingProduct = await productRepository.getById(id);
  if (!existingProduct) {
    throw new NotFoundError("NotFound");
  }
  return existingProduct;
}

async function update(
  id: number,
  { name, description, price, tags, images }: ProductUpdateData
) {
  return productRepository.update(id, {
    name,
    description,
    price,
    tags,
    images,
  });
}

async function deleteId(id: number) {
  return productRepository.deleteId(id);
}

async function commentProduct(
  productId: number,
  content: string,
  user: number
) {
  return commentsRepository.commentProduct(productId, content, user);
}

async function findCommentsByProduct(
  productId: number,
  cursor: number,
  limit: number
) {
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
