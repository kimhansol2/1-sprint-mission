import { Request, Response } from 'express';
import { readNotify } from '../services/notificationService';
import { IdParamsStruct } from '../structs/commonStruct';
import { create } from 'superstruct';

export const readNotification = async (req: Request, res: Response) => {
  const user = req.user;
  const notification = create(req.params, IdParamsStruct);

  const result = await readNotify(user!.id, notification.id);
  res.status(200).json(result);
  return;
};
