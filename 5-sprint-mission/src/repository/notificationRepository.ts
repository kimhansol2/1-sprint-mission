import { boolean } from 'superstruct';
import prisma from '../lib/prisma';
import { notificationType, createNotificationType } from '../types/notificationType';

export const updateRead = async (notificationId: number): Promise<notificationType> => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
};

export const create = async ({ userId, type, payload }: createNotificationType) => {
  return prisma.notification.create({
    data: { userId, type, payload },
  });
};

export const findNotifications = async (
  userId: number,
  onlyUnread: boolean,
): Promise<notificationType[]> => {
  return prisma.notification.findMany({
    where: {
      userId,
      ...(onlyUnread ? { read: false } : {}),
    },
  });
};
