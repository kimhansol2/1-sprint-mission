import express from "express";
import { asyncHandler } from "../lib/async-handler";
import {
  createProduct,
  getProduct,
  getProductList,
  updateProduct,
  deleteProduct,
} from "../controller/productController";

const productRouter = express.Router();

productRouter.post("/", asyncHandler(createProduct));
productRouter.get("/", asyncHandler(getProductList));
productRouter.get("/:id", asyncHandler(getProduct));
productRouter.patch("/:id", asyncHandler(updateProduct));
productRouter.delete("/:id", asyncHandler(deleteProduct));
