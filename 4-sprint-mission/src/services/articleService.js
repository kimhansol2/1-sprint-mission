import articleRepository from "../repository/articleRepository.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import commentsRepository from "../repository/commentsRepository.js";

async function create(article) {
  return await articleRepository.save(article);
}

async function getList({ page, pagesize, orderBy, keyword }) {
  const totalCount = await articleRepository.countArticle(keyword);

  page = page > 0 ? page : 1;
  pagesize = pagesize > 0 ? pagesize : 10;

  const articles = await articleRepository.findArticle(
    page,
    pagesize,
    orderBy,
    keyword
  );
  return { list: articles, totalCount };
}

async function getById(id) {
  const existingArticle = await articleRepository.findById(id);

  if (!existingArticle) {
    throw new NotFoundError("article", id);
  }
  return existingArticle;
}

async function update(id, data) {
  return articleRepository.update(id, data);
}

async function deleteById(id) {
  return articleRepository.deleteById(id);
}

async function saveComment(articleId, content, user) {
  return commentsRepository.commentArticle(articleId, content, user);
}

async function findCommentsByArticle(articleId, cursor, limit) {
  const commentsWithCursor = await commentsRepository.findCommentsByArticle(
    articleId,
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
  getList,
  getById,
  update,
  deleteById,
  saveComment,
  findCommentsByArticle,
};
