import request from 'supertest';
import app from '../app';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import { clearDatabase } from '../lib/testUtils';

describe('user API 테스트', () => {
  let hashed: string;
  beforeAll(async () => {
    await clearDatabase(prisma);
    hashed = await bcrypt.hash('password1234', 10);
  });

  describe('인증이 없는 api 테스트', () => {
    describe('POST /users 테스트', () => {
      test('유저 생성 테스트(성공)', async () => {
        const response = await request(app).post('/users').send({
          email: 'gosol12@naver.com',
          password: 'password1234',
          nickname: 'gosol',
        });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          email: 'gosol12@naver.com',
          nickname: 'gosol',
        });
      });

      test('유저 생성 테스트(실패)', async () => {
        const response = await request(app).post('/users').send({
          email: 'gosol12@naver.com',
          password: 'password1234',
          nickname: 'gosol',
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('이미 존재하는 이메일입니다.');
      });
    });

    describe('POST /users/login 테스트', () => {
      test('유저 로그인 테스트(성공)', async () => {
        const response = await request(app).post('/users/login').send({
          email: 'gosol12@naver.com',
          password: 'password1234',
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('로그인 성공');
      });

      test('유저 로그인 테스트(실패)', async () => {
        const response = await request(app).post('/users/login').send({
          email: 'gosol1@naver.com',
          password: 'password1234',
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized');
      });

      test('유저 로그인 테스트(비밀번호 실패)', async () => {
        const response = await request(app).post('/users/login').send({
          email: 'gosol12@naver.com',
          password: 'password1233',
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
      });
    });
    describe('GET /users/:id 테스트', () => {
      let userId: number;
      beforeAll(async () => {
        const user = await prisma.user.create({
          data: { email: 'user12@gmail.com', password: hashed, nickname: 'user1' },
        });

        userId = user.id;
      });
      test('user 정보 조회 테스트(성공)', async () => {
        const response = await request(app).get(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          email: 'user12@gmail.com',
          nickname: 'user1',
        });
      });
      test('user 정보 조회 테스트(성공)', async () => {
        const response = await request(app).get(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          email: 'user12@gmail.com',
          nickname: 'user1',
        });
      });

      test('user 정보 조회 테스트(실패)', async () => {
        const response = await request(app).get(`/users/999`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('NotFound');
      });
    });
  });

  describe('인증이 있는 api 테스트', () => {
    const agent = request.agent(app);
    let userId: number;
    beforeAll(async () => {
      const user = await prisma.user.create({
        data: { email: 'user123@gmail.com', password: hashed, nickname: 'user1' },
      });

      userId = user.id;

      const loginRes = await agent.post('/users/login').send({
        email: 'user123@gmail.com',
        password: 'password1234',
      });
      expect(loginRes.status).toBe(200);
    });

    describe('GET /users/notification', () => {
      beforeAll(async () => {
        await prisma.notification.createMany({
          data: [
            { userId, type: 'COMMENT_CREATED', payload: {}, read: false },
            { userId, type: 'PRICE_UPDATED', payload: {}, read: true },
          ],
        });
      });
      test('notification 알림 테스트', async () => {
        const response = await agent.get('/users/notification');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
      });
      test('notification 알림 테스트 (읽지 않음)', async () => {
        const response = await agent.get('/users/notification').query({ read: true });
        expect(response.status).toBe(200);
        expect(response.body[0].userId).toBe(userId);
      });
    });

    describe('PATCH /users/:id', () => {
      beforeAll(async () => {
        const user = await prisma.user.create({
          data: { email: 'user1234@gmail.com', password: hashed, nickname: 'user1' },
        });

        userId = user.id;

        const loginRes = await agent.post('/users/login').send({
          email: 'user1234@gmail.com',
          password: 'password1234',
        });
        expect(loginRes.status).toBe(200);
      });

      test('patch 수정 테스트 (전체)', async () => {
        const response = await agent.patch(`/users/${userId}`).send({
          email: 'gosol123@naver.com',
          password: 'password123',
          nickname: 'gosol123',
        });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          email: 'gosol123@naver.com',
          nickname: 'gosol123',
        });
      });

      test('patch 수정 테스트 (부분)', async () => {
        const response = await agent.patch(`/users/${userId}`).send({
          nickname: 'gosol',
        });
        expect(response.status).toBe(200);
        expect(response.body.email).toBe('gosol123@naver.com');
      });
    });

    describe('GET /users/:id/products', () => {
      beforeAll(async () => {
        const user = await prisma.user.create({
          data: { email: 'user345@gmail.com', password: hashed, nickname: 'user1' },
        });

        userId = user.id;

        for (let i = 0; i < 20; i++) {
          const product = await prisma.product.create({
            data: {
              name: `하얀색 티셔츠${i}`,
              description: `반팔로 된 좋은 티셔츠${i}`,
              price: 1000 * i,
              tags: ['TSHIRT'],
              images: ['https://example.com/image1.jpg'],
              user: {
                connect: { id: userId },
              },
            },
          });
        }
      });

      test('유저 product 테스트(전체)', async () => {
        const response = await agent.get(`/users/${userId}/products`);
        expect(response.status).toBe(200);
      });

      test('유저 product 테스트(조건 page)', async () => {
        const response = await agent.get(`/users/${userId}/products`).query({ page: 3 });
        expect(response.status).toBe(200);
      });
      test('유저 product 테스트(조건 pagesize)', async () => {
        const response = await agent.get(`/users/${userId}/products`).query({ pagesize: 5 });
        expect(response.status).toBe(200);
      });
      test('유저 product 테스트(조건 orderBy)', async () => {
        const response = await agent.get(`/users/${userId}/products`).query({ orderBy: 'recent' });
        expect(response.status).toBe(200);
      });
      test('유저 product 테스트(조건 keyword)', async () => {
        const response = await agent.get(`/users/${userId}/products`).query({ keyword: '하얀색' });
        expect(response.status).toBe(200);
      });

      test('유저 product 테스트(실패)', async () => {
        const response = await agent.get(`/users/non-exist-id/products`);
        expect(response.status).toBe(400);
      });
    });

    describe('POST /token/refresh', () => {
      beforeAll(async () => {
        const user = await prisma.user.create({
          data: { email: 'user5555@gmail.com', password: hashed, nickname: 'user1' },
        });

        userId = user.id;

        const loginRes = await agent.post('/users/login').send({
          email: 'user5555@gmail.com',
          password: 'password1234',
        });
        expect(loginRes.status).toBe(200);
      });

      test('refresh 토큰 재발급 테스트', async () => {
        const response = await agent.post('/users/token/refresh');
        expect(response.status).toBe(200);
      });
      test('refresh 토큰 재발급 테스트(인증 실패)', async () => {
        const response = await request(app).post('/users/token/refresh');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid refresh token');
      });
    });

    describe('GET /:id/productLikes', () => {
      beforeAll(async () => {
        const user = await prisma.user.create({
          data: { email: 'user3333@gmail.com', password: hashed, nickname: 'user1' },
        });
        userId = user.id;

        const loginRes = await agent.post('/users/login').send({
          email: 'user3333@gmail.com',
          password: 'password1234',
        });
        expect(loginRes.status).toBe(200);
      });
      test('유저 productLike 테스트 성공(전체))', async () => {
        const response = await agent.get(`/users/${userId}/productLikes`);
        expect(response.status).toBe(200);
      });
      test('유저 productLike 테스트 성공(page)', async () => {
        const response = await agent.get(`/users/${userId}/productLikes`).query({ page: 3 });
        expect(response.status).toBe(200);
      });
      test('유저 productLike 테스트 (pagesize))', async () => {
        const response = await agent.get(`/users/${userId}/productLikes`).query({ pagesize: 5 });
        expect(response.status).toBe(200);
      });
    });
  });
});
