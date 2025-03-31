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
import passport from "../middlewares/passport";
import { verifyuserAuth } from "../middlewares/jwtAuth.js";

const userRouter = express.Router();

userRouter.post("/", asyncHandler(createUser));
userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  asyncHandler(loginUser)
);
userRouter.get(
  "/:id",
  passport.authenticate("accessToken", { session: false }),
  verifyuserAuth,
  asyncHandler(getUser)
);
userRouter.patch(
  "/:id",
  passport.authenticate("accessToken", { session: false }),
  verifyuserAuth,
  asyncHandler(updateUser)
);

userRouter.get(
  "/:id/products",
  passport.authenticate("accessToken", { session: false }),
  verifyuserAuth,
  asyncHandler(userProductList)
);

userRouter.post(
  "/token/refresh",
  passport.authenticate("accessToken", { session: false }),
  asyncHandler(userNewToken)
);

userRouter.get(
  "/:id/productLikes",
  passport.authenticate("accessToken", { session: false }),
  verifyuserAuth,
  asyncHandler(likeProducts)
);

export default userRouter;
