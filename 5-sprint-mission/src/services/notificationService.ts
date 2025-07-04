import { Server } from 'socket.io';
import { createNotificationType } from '../types/notificationType';
import {
  create,
  findNotifications,
  isRead,
  updateRead,
} from '../repository/notificationRepository';
import { porductLikedFindPerson } from '../repository/likeRepository';
import { notificationDTO } from '../dto/notificationDTO';

let io: Server;

export const registerSocketIo = (ioInstance: Server) => {
  io = ioInstance;
  console.log('✅ Socket.IO 등록됨');
};

export const createNotification = async ({ userId, type, payload }: createNotificationType) => {
  console.log('알림 생성 시작', { userId, type });

  const notification = await create({ userId, type, payload });
  console.log('✅ 알림 저장 완료:', notification);

  io.to(`user:${userId}`).emit('notification', notification);
  console.log('📤 알림 전송됨: user_', userId);

  return notification;
};

export const notifyPriceChanged = async (productId: number, newPrice: number) => {
  const likes = await porductLikedFindPerson(productId);

  await Promise.all(
    likes.map(({ userId }) =>
      createNotification({
        userId,
        type: 'PRICE_UPDATED',
        payload: {
          productId,
          newPrice,
        },
      }),
    ),
  );
};

export const findNotification = async (userId: number, onlyUnread: boolean) => {
  return findNotifications(userId, onlyUnread);
};

export const readNotify = async (userId: number, id: number) => {
  const notification = await isRead(userId, id);
  if (!notification) {
    throw new Error('not found');
  }

  if (notification.read === false) {
    const dataUpdate = await updateRead(id);
    return new notificationDTO(dataUpdate.read);
  }

  return notification;
};
