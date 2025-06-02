import express from 'express';
import { asyncHandler } from '../lib/async-handler';
import {
  createUser,
  getUser,
  loginUser,
  updateUser,
  userProductList,
  userNewToken,
  likeProducts,
  myNotification,
} from '../controller/userController';
import { authenticate } from '../middlewares/authenticate';

const userRouter = express.Router();

userRouter.post('/', asyncHandler(createUser));
userRouter.post('/login', asyncHandler(loginUser));
userRouter.get('/notification', authenticate(), asyncHandler(myNotification));
userRouter.get('/:id', authenticate({ optional: true }), asyncHandler(getUser));
userRouter.patch('/:id', authenticate(), asyncHandler(updateUser));
userRouter.get('/:id/products', authenticate(), asyncHandler(userProductList));
userRouter.post('/token/refresh', asyncHandler(userNewToken));
userRouter.get('/:id/productLikes', authenticate(), asyncHandler(likeProducts));

export default userRouter;
