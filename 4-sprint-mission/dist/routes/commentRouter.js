"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentsController_js_1 = require("../controller/commentsController.js");
const async_handler_js_1 = require("../lib/async-handler.js");
const passport_1 = __importDefault(require("../middlewares/passport"));
const jwtAuth_js_1 = require("../middlewares/jwtAuth.js");
const commentRouter = express_1.default.Router();
commentRouter.patch("/:id", passport_1.default.authenticate("accessToken", { session: false }), jwtAuth_js_1.verifycommentAuth, (0, async_handler_js_1.asyncHandler)(commentsController_js_1.updateComment));
commentRouter.delete("/:id", passport_1.default.authenticate("accessToken", { session: false }), jwtAuth_js_1.verifycommentAuth, (0, async_handler_js_1.asyncHandler)(commentsController_js_1.deleteComment));
exports.default = commentRouter;
