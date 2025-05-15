import 'express';
import { User as PrismaUser } from '@prisma/client';
import { Socket } from 'socket.io';
declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

declare module 'socket.io' {
  interface Socket {
    user?: {
      id: number;
    };
  }
}
