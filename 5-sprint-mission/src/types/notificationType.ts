import { JsonValue } from '@prisma/client/runtime/library';
import { Prisma, NotificationType as PrismaNotificationType } from '@prisma/client';

export interface notificationType {
  id: number;
  userId: number;
  type: PrismaNotificationType;
  payload: JsonValue;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface createNotificationType {
  userId: number;
  type: PrismaNotificationType;
  payload: Prisma.InputJsonValue;
}
