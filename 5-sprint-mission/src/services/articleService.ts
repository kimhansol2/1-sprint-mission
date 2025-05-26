import {
  savedata,
  countArticle,
  findArticle,
  findById,
  updatedata,
  deleteByIdData,
  findArticleAuthorId,
} from '../repository/articleRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { commentArticle, findCommentsByArticles } from '../repository/commentsRepository';
import { ArticleCreateData, ArticleUpdateData } from '../dto/articleDTO';
import { ArticleCommnetCreateData } from '../dto/commentDTO';
import { createNotification } from './notificationService';

interface GetListParams {
  page: number;
  pagesize: number;
  orderBy?: 'recent' | 'id';
  keyword?: string;
}

export async function save(article: ArticleCreateData) {
  return await savedata(article);
}

export async function getList(
  userId: number,
  { page, pagesize, orderBy = 'recent', keyword }: GetListParams,
) {
  const totalCount = await countArticle(keyword);

  page = page > 0 ? page : 1;
  pagesize = pagesize > 0 ? pagesize : 10;

  const articles = await findArticle(userId, page, pagesize, orderBy, keyword);
  return {
    list: articles.map((article) => ({
      ...article,
      isLiked: userId ? article.ArticleLike.length > 0 : false,
      ArticleLike: undefined,
    })),
    totalCount,
  };
}

export async function getById(id: number) {
  const existingArticle = await findById(id);

  if (!existingArticle) {
    throw new NotFoundError('NotFound');
  }
  return existingArticle;
}

export async function update(updateData: ArticleUpdateData) {
  return updatedata(updateData);
}

export async function deleteById(id: number) {
  return deleteByIdData(id);
}

export async function saveComment(comment: ArticleCommnetCreateData) {
  const newComment = await commentArticle(comment);

  if (newComment.articleId) {
    const articleAuthorId = await findArticleAuthorId(newComment.articleId);

    if (articleAuthorId && articleAuthorId !== newComment.userId) {
      await createNotification({
        userId: articleAuthorId,
        type: 'COMMENT_CREATED',
        payload: {
          articleId: newComment.articleId,
          commentId: newComment.id,
        },
      });
    }
  }

  return newComment;
}

export async function findCommentsByArticle(articleId: number, cursor: number, limit: number) {
  const commentsWithCursor = await findCommentsByArticles(articleId, cursor, limit + 1);

  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return {
    list: comments,
    nextCursor,
  };
}
