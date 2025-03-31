import articleRepository from "../repository/articleRepository";
import NotFoundError from "../lib/errors/NotFoundError";
import commentsRepository from "../repository/commentsRepository";
import { ArticleCreateData, ArticleUpdateDate } from "../types/articleTypes";

interface GetListParams {
  page: number;
  pagesize: number;
  orderBy?: "recent" | "id";
  keyword?: string;
}

async function create(article: ArticleCreateData) {
  return await articleRepository.save(article);
}

async function getList(
  userId: number,
  { page, pagesize, orderBy = "recent", keyword }: GetListParams
) {
  const totalCount = await articleRepository.countArticle(keyword);

  page = page > 0 ? page : 1;
  pagesize = pagesize > 0 ? pagesize : 10;

  const articles = await articleRepository.findArticle(
    userId,
    page,
    pagesize,
    orderBy,
    keyword
  );
  return {
    list: articles.map((article) => ({
      ...article,
      isLiked:
        article.ArticleLike.length > 0 ? article.ArticleLike[0].isLiked : false,
      ArticleLike: undefined,
    })),
    totalCount,
  };
}

async function getById(id: number) {
  const existingArticle = await articleRepository.findById(id);

  if (!existingArticle) {
    throw new NotFoundError("NotFound");
  }
  return existingArticle;
}

async function update(id: number, data: ArticleUpdateDate) {
  return articleRepository.update(id, data);
}

async function deleteById(id: number) {
  return articleRepository.deleteById(id);
}

async function saveComment(articleId: number, content: string, user: number) {
  return commentsRepository.commentArticle(articleId, content, user);
}

async function findCommentsByArticle(
  articleId: number,
  cursor: number,
  limit: number
) {
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
