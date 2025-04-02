"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const async_handler_js_1 = require("../lib/async-handler.js");
const imagesController_js_1 = require("../controller/imagesController.js");
const imagesRouter = express_1.default.Router();
imagesRouter.post("/upload", imagesController_js_1.upload.single("image"), (0, async_handler_js_1.asyncHandler)(imagesController_js_1.uploadImage));
exports.default = imagesRouter;
