import express from 'express';
import { asyncHandler } from '../lib/async-handler';
import authenticate from '../middlewares/authenticate';
import { readNotification } from '../controller/notificationsController';

const notificationsRouter = express.Router();

notificationsRouter.patch('/:id/read', authenticate(), asyncHandler(readNotification));

export default notificationsRouter;
