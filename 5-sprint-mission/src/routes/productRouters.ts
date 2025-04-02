import express from 'express';
import { asyncHandler } from '../lib/async-handler';
import {
  createProduct,
  getProduct,
  getProductList,
  updateProduct,
  deleteProduct,
  createComment,
  getCommentList,
  productLike,
} from '../controller/productController';
import { authenticate } from '../middlewares/authenticate';

const productRouter = express.Router();

productRouter.post('/', authenticate(), asyncHandler(createProduct));
productRouter.get('/', authenticate({ optional: true }), asyncHandler(getProductList));
productRouter.get('/:id', authenticate({ optional: true }), asyncHandler(getProduct));
productRouter.patch('/:id', authenticate(), asyncHandler(updateProduct));
productRouter.delete('/:id', authenticate(), asyncHandler(deleteProduct));
productRouter.post('/:id/comments', authenticate(), asyncHandler(createComment));
productRouter.get('/:id/comments', asyncHandler(getCommentList));
productRouter.post('/:id/likes', authenticate(), asyncHandler(productLike));

export default productRouter;
