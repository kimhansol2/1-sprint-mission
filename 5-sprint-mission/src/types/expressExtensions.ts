import 'express';
import { User as PrismaUser } from '@prisma/client';

/**declare module 'socket.io' {
  interface Socket {
    user?: {
      id: number;
    };
  }
}**/

declare global {
  namespace Express {
    interface User extends PrismaUser {}
    interface Request {
      user?: User;
    }
  }
}

export {};
