import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { notificationGateway } from './notificationGateway';
import { registerSocketIo } from '../services/notificationService';

export function setupSocketIO(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://127.0.0.1:5500',
      credentials: true,
    },
  });

  registerSocketIo(io);

  io.use((socket, next) => {
    const token = socket.handshake.auth?.accessToken;
    if (!token) {
      console.log('❌ [Socket.IO] 토큰 없음');
      return next(new Error('토큰 없음'));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!) as { userId: number };
      socket.user = { id: payload.userId };
      console.log('✅ [Socket.IO] 인증 성공 - userId:', payload.userId);
      next();
    } catch (err) {
      const error = err as Error;
      console.error('❌ [Socket.IO] 토큰 검증 실패:', error.message);
      next(new Error('토큰 검증 실패'));
    }
  });

  io.on('connection', (socket) => {
    notificationGateway(io, socket);
  });

  return io;
}
