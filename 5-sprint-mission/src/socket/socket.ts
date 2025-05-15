import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { notificationGateway } from './notificationGateway';

export function setupSocketIO(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
    path: '/socket.io',
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.accessToken;
    if (!token) {
      return next(new Error('토큰 없음'));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
      socket.user = { id: payload.id };
      next();
    } catch {
      next(new Error('토큰 검증 실패'));
    }
  });

  io.on('connection', (socket) => {
    notificationGateway(io, socket);
  });

  return io;
}
