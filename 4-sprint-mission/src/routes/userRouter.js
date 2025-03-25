import express from "express";
import { asyncHandler } from "../lib/async-handler.js";
import {
  createUser,
  getUser,
  loginUser,
  updateUser,
  userProductList,
  userNewToken,
  likeProducts,
} from "../controller/userController.js";
import Auth from "../middlewares/Auth.js";

const userRouter = express.Router();

userRouter.post("/", asyncHandler(createUser));
userRouter.post("/session-login", asyncHandler(loginUser));
userRouter.get("/:id", asyncHandler(getUser));
userRouter.patch(
  "/:id",
  Auth.verifySessionLogin,
  Auth.verifyAccessToken,
  asyncHandler(updateUser)
);
userRouter.get(
  "/:id/products",
  Auth.verifySessionLogin,
  Auth.verifyAccessToken,
  asyncHandler(userProductList)
);
userRouter.post(
  "/token/refresh",
  Auth.verifyRefreshToken,
  asyncHandler(userNewToken)
);
userRouter.get("/:id/productLikes", asyncHandler(likeProducts));

export default userRouter;
