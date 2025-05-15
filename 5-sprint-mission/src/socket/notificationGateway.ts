import { Server, Socket } from 'socket.io';
import { updateRead } from '../repository/notificationRepository';

export function notificationGateway(io: Server, socket: Socket) {
  const userId = socket.user?.id;

  if (!userId) {
    console.warn('소켓 연결 시 사용자 정보가 없습니다.');
    return;
  }

  socket.join(`user:${userId}`);
  console.log(`유저 ${userId}가 user:${userId}방에 입장`);

  socket.on('mark_as_read', async (notificationId: number) => {
    await updateRead(notificationId);
  });

  socket.on('disconnect', () => {
    console.log(`유저 ${userId} 연결 종료`);
  });
}
