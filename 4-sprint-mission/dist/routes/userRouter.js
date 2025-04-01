"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const async_handler_js_1 = require("../lib/async-handler.js");
const userController_1 = require("../controller/userController");
const passport_1 = __importDefault(require("../middlewares/passport"));
const jwtAuth_js_1 = require("../middlewares/jwtAuth.js");
const userRouter = express_1.default.Router();
userRouter.post("/", (0, async_handler_js_1.asyncHandler)(userController_1.createUser));
userRouter.post("/login", passport_1.default.authenticate("local", { session: false }), (0, async_handler_js_1.asyncHandler)(userController_1.loginUser));
userRouter.get("/:id", passport_1.default.authenticate("accessToken", { session: false }), jwtAuth_js_1.verifyuserAuth, (0, async_handler_js_1.asyncHandler)(userController_1.getUser));
userRouter.patch("/:id", passport_1.default.authenticate("accessToken", { session: false }), jwtAuth_js_1.verifyuserAuth, (0, async_handler_js_1.asyncHandler)(userController_1.updateUser));
userRouter.get("/:id/products", passport_1.default.authenticate("accessToken", { session: false }), jwtAuth_js_1.verifyuserAuth, (0, async_handler_js_1.asyncHandler)(userController_1.userProductList));
userRouter.post("/token/refresh", passport_1.default.authenticate("accessToken", { session: false }), (0, async_handler_js_1.asyncHandler)(userController_1.userNewToken));
userRouter.get("/:id/productLikes", passport_1.default.authenticate("accessToken", { session: false }), jwtAuth_js_1.verifyuserAuth, (0, async_handler_js_1.asyncHandler)(userController_1.likeProducts));
exports.default = userRouter;
