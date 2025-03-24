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
  productLike,
} from "../controller/productController.js";
import Auth from "../middlewares/Auth.js";

const productRouter = express.Router();

productRouter.post("/", Auth.verifySessionLogin, asyncHandler(createProduct));
productRouter.get("/", asyncHandler(getProductList));
productRouter.get("/:id", asyncHandler(getProduct));
productRouter.patch(
  "/:id",
  Auth.verifySessionLogin,
  Auth.verifyProductAuth,
  asyncHandler(updateProduct)
);
productRouter.delete(
  "/:id",
  Auth.verifySessionLogin,
  Auth.verifyProductAuth,
  asyncHandler(deleteProduct)
);
productRouter.post("/:id/comments", asyncHandler(createComment));
productRouter.get("/:id/comments", asyncHandler(getCommentList));
productRouter.post("/:id/likes", asyncHandler(productLike));

export default productRouter;
