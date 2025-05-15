import { Server } from 'socket.io';
import { createNotificationType } from '../types/notificationType';
import { create } from '../repository/notificationRepository';

let io: Server;

export const registerSocketIo = (ioInstance: Server) => {
  io = ioInstance;
};

export const createNotification = async ({ userId, type, payload }: createNotificationType) => {
  const notification = await create({ userId, type, payload });

  io.to(`user_${userId}`).emit('notification', notification);

  return notification;
};
