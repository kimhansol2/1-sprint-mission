import prisma from '../lib/prisma';
import { notificationType, createNotificationType } from '../types/notificationType';

export const updateRead = async (notificationId: number): Promise<notificationType> => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
};

export const create = async ({
  userId,
  type,
  payload,
}: createNotificationType): Promise<notificationType> => {
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

export const isRead = async (userId: number, id: number): Promise<{ read: boolean } | null> => {
  return prisma.notification.findFirst({
    where: {
      id,
      userId,
    },
    select: { read: true },
  });
};
