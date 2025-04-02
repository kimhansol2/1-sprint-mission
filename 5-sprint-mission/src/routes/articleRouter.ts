import express from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
  articleLike,
} from '../controller/articleController.js';
import { authenticate } from '../middlewares/authenticate';

const articlesRouter = express.Router();

articlesRouter.post('/', authenticate(), asyncHandler(createArticle));
articlesRouter.get('/', authenticate({ optional: true }), asyncHandler(getArticleList));
articlesRouter.get('/:id', authenticate({ optional: true }), asyncHandler(getArticle));
articlesRouter.patch('/:id', authenticate(), asyncHandler(updateArticle));
articlesRouter.delete('/:id', authenticate(), asyncHandler(deleteArticle));
articlesRouter.post('/:id/comments', authenticate(), asyncHandler(createComment));
articlesRouter.get('/:id/comments', asyncHandler(getCommentList));
articlesRouter.post('/:id/likes', authenticate(), asyncHandler(articleLike));

export default articlesRouter;
