import { Socket } from 'socket.io';

export function notificationGateway(socket: Socket) {
  const userId = socket.user?.id;
  console.log(`✅ 유저 ${userId} 소켓 연결됨`);
  if (!userId) {
    console.warn('소켓 연결 시 사용자 정보가 없습니다.');
    return;
  }

  socket.join(`user:${userId}`);
  console.log(`유저 ${userId}가 user:${userId}방에 입장`);
}
