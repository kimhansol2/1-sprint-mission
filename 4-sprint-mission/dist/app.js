"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("./lib/constants");
const productRouters_1 = __importDefault(require("./routes/productRouters"));
const articleRouter_1 = __importDefault(require("./routes/articleRouter"));
const commentRouter_1 = __importDefault(require("./routes/commentRouter"));
const imagesRouter_1 = __importDefault(require("./routes/imagesRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const errorController_1 = require("./controller/errorController");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(constants_1.STATIC_PATH, express_1.default.static(path_1.default.resolve(process.cwd(), constants_1.PUBLIC_PATH)));
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize()); // passport 초기화 함수(요청(req)객체에 인증 관련 기능 추가)
app.use("/products", productRouters_1.default);
app.use("/articles", articleRouter_1.default);
app.use("/comments", commentRouter_1.default);
app.use("/images", imagesRouter_1.default);
app.use("/users", userRouter_1.default);
app.use(errorController_1.defaultNotFoundHandler);
app.use(errorController_1.globalErrorHandler);
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
