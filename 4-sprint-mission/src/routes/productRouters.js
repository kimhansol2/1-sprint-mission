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

const productRouter = express.Router();

productRouter.post("/", asyncHandler(createProduct));
productRouter.get("/", asyncHandler(getProductList));
productRouter.get("/:id", asyncHandler(getProduct));
productRouter.patch("/:id", asyncHandler(updateProduct));
productRouter.delete("/:id", asyncHandler(deleteProduct));
productRouter.post("/:id/comments", asyncHandler(createComment));
productRouter.get("/:id/comments", asyncHandler(getCommentList));

export default productRouter;
