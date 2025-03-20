import express from "express";
import { asyncHandler } from "../lib/async-handler";
import { upload, uploadImage } from "../controller/imagesController.js";

const imagesRouter = express.Router();

imagesRouter.post("/upload", upload.single("image"), asyncHandler(uploadImage));

export default imagesRouter;
