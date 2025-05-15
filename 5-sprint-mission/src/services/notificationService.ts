import { Server } from 'socket.io';
import { createNotificationType } from '../types/notificationType';
import { create } from '../repository/notificationRepository';

let io: Server;

export const registerSocketIo = (ioInstance: Server) => {
  io = ioInstance;
  console.log('✅ Socket.IO 등록됨');
};

export const createNotification = async ({ userId, type, payload }: createNotificationType) => {
  console.log('알림 생성 시작', { userId, type });

  const notification = await create({ userId, type, payload });
  console.log('✅ 알림 저장 완료:', notification);

  io.to(`user_${userId}`).emit('notification', notification);
  console.log('📤 알림 전송됨: user_', userId);

  return notification;
};
