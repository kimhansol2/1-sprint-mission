import express from "express";
import { asyncHandler } from "../lib/async-handler.js";
import {
  createProduct,
  getProduct,
  getProductList,
  updateProduct,
  deleteProduct,
  createComment,
  getCommentList,
} from "../controller/productController.js";
import passport from "../middlewares/passport.js";
import { verifyproductAuth } from "../middlewares/jwtAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  passport.authenticate("accessToken", { session: false }),
  asyncHandler(createProduct)
);
productRouter.get("/", asyncHandler(getProductList));
productRouter.get("/:id", asyncHandler(getProduct));
productRouter.patch(
  "/:id",
  passport.authenticate("accessToken", { session: false }),
  verifyproductAuth,
  asyncHandler(updateProduct)
);
productRouter.delete(
  "/:id",
  passport.authenticate("accessToken", { session: false }),
  verifyproductAuth,
  asyncHandler(deleteProduct)
);
productRouter.post(
  "/:id/comments",
  passport.authenticate("accessToken", { session: false }),
  asyncHandler(createComment)
);
productRouter.get("/:id/comments", asyncHandler(getCommentList));

export default productRouter;
