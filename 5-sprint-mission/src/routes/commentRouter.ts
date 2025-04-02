import express from 'express';
import { updateComment, deleteComment } from '../controller/commentsController.js';
import { asyncHandler } from '../lib/async-handler.js';
import { authenticate } from '../middlewares/authenticate';

const commentRouter = express.Router();

commentRouter.patch('/:id', authenticate(), asyncHandler(updateComment));
commentRouter.delete('/:id', authenticate(), asyncHandler(deleteComment));

export default commentRouter;
