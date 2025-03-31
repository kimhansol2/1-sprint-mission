import express from "express";
import cors from "cors";
import path from "path";
import { PUBLIC_PATH, STATIC_PATH } from "./lib/constants";
import productRouter from "./routes/productRouters";
import articleRouter from "./routes/articleRouter";
import commentRouter from "./routes/commentRouter";
import imagesRouter from "./routes/imagesRouter";
import userRouter from "./routes/userRouter";
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from "./controller/errorController";
import cookieParser from "cookie-parser";
import passport from "passport";

const app: express.Application = express();
app.use(cors());
app.use(express.json());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));
app.use(cookieParser());

app.use(passport.initialize()); // passport 초기화 함수(요청(req)객체에 인증 관련 기능 추가)

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/images", imagesRouter);
app.use("/users", userRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
