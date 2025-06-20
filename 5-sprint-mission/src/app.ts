import './types/expressExtensions';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { PUBLIC_PATH } from './lib/constants';
import productRouter from './routes/productRouters';
import articleRouter from './routes/articleRouter';
import commentRouter from './routes/commentRouter';
import imagesRouter from './routes/imagesRouter';
import userRouter from './routes/userRouter';
import notificationRouter from './routes/notificationRouter';
import { defaultNotFoundHandler, globalErrorHandler } from './controller/errorController';
import cookieParser from 'cookie-parser';
import { setupSocketIO } from './socket/socket';
import http from 'http';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(PUBLIC_PATH)));
app.use(cookieParser());

const server = http.createServer(app);
setupSocketIO(server);

app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);
app.use('/images', imagesRouter);
app.use('/users', userRouter);
app.use('/notifications', notificationRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

export default app;
