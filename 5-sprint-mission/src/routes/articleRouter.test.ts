import request from 'supertest';
import app from '../app';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import { Article, User } from '@prisma/client';
import { clearDatabase, clearCommentsWithReset } from '../lib/testUtils';

describe('게시글 API 테스트', () => {
  let user: User;
  beforeAll(async () => {
    await clearDatabase(prisma);
    let hashed = await bcrypt.hash('password123', 10);
    user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashed,
        nickname: 'Test User',
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('인증이 필요없는 API', () => {
    describe('GET /articles', () => {
      beforeAll(async () => {
        for (let i = 0; i < 20; i++) {
          await prisma.article.create({
            data: {
              title: `Test Article${i}`,
              content: 'Test Content',
              createdAt: new Date(Date.now() + i),
              user: {
                connect: { id: user.id },
              },
            },
          });
        }
      });

      test('모든 댓글을 조회할 수 있다.', async () => {
        const response = await request(app).get('/articles');
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(10);
        expect(response.body.totalCount).toBe(20);
      });

      test('page를 통한 댓글 조회.', async () => {
        const response = await request(app).get('/articles').query({ page: 3 });
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(0);
      });

      test('pagesize를 통한 댓글 조회.', async () => {
        const response = await request(app).get('/articles').query({ pagesize: 5 });
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(5);
      });

      test('orderBy를 통한 댓글 조회.', async () => {
        const response = await request(app).get('/articles').query({ orderBy: 'recent' });
        expect(response.status).toBe(200);
        expect(response.body.list[0].title).toBe('Test Article19');
        expect(response.body.list[9].title).toBe('Test Article10');
      });

      test('keyword를 통한 댓글 조회.', async () => {
        const response = await request(app).get('/articles').query({ keyword: 'Article9' });
        expect(response.status).toBe(200);
        expect(response.body.list[0].title).toBe('Test Article9');
        expect(response.body.list.length).toBe(1);
      });
    });

    describe('GET /articles/:id', () => {
      let articleId: number;

      beforeAll(async () => {
        for (let i = 0; i < 20; i++) {
          const article = await prisma.article.create({
            data: {
              title: `Test Article${i}`,
              content: 'Test Content',
              createdAt: new Date(Date.now() + i),
              user: {
                connect: { id: user.id },
              },
            },
          });
          articleId = article.id;
        }
      });

      test('id 검색 테스트', async () => {
        const response = await request(app).get(`/articles/${articleId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(articleId);
        expect(response.body.title).toBe('Test Article19');
      });

      test('id 404 에러 테스트', async () => {
        const response = await request(app).get(`/articles/9999`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('NotFound');
      });
    });
  });

  describe('인증이 필요한 API', () => {
    const agent = request.agent(app);
    beforeAll(async () => {
      const res = await agent.post('/users/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(200);
    });
    describe('POST /articles', () => {
      test('article 성공적으로 생성 테스트(전체 항목)', async () => {
        const response = await agent.post('/articles').send({
          title: '제목',
          content: '내용',
          image: 'image1',
        });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          title: '제목',
          content: '내용',
          image: 'image1',
        });
      });

      test('article 성공적으로 생성 테스트(필수 요소:title, content)', async () => {
        const response = await agent.post('/articles').send({
          title: '제목',
          content: '내용',
        });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          title: '제목',
          content: '내용',
          image: null,
        });
      });
      test('article 생성 실패 테스트 (생성 항목 부족)', async () => {
        const response = await agent.post('/articles').send({
          title: '제목',
        });
        expect(response.status).toBe(400);
      });
    });
    let article: Article;
    describe('PATCH /articles/:id', () => {
      beforeEach(async () => {
        article = await prisma.article.create({
          data: {
            title: '제목',
            content: '내용',
            image: 'image1',
            user: {
              connect: { id: user.id },
            },
          },
        });
      });
      test('article 성공적으로 수정 테스트(전체 항목)', async () => {
        const response = await agent.patch(`/articles/${article.id}`).send({
          title: '제목1',
          content: '내용1',
          image: 'image2',
        });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          title: '제목1',
          content: '내용1',
          image: 'image2',
        });
        expect(response.body.id).toBe(article.id);
      });

      test('article 성공적으로 수정 테스트(일부 항목)', async () => {
        const response = await agent.patch(`/articles/${article.id}`).send({
          title: '제목3',
        });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          title: '제목3',
          content: '내용',
          image: 'image1',
        });
        expect(response.body.id).toBe(article.id);
      });

      test('article 수정 실패 테스트', async () => {
        const response = await agent.patch(`/articles/non-exist-id`).send({
          title: '제목3',
        });
        expect(response.status).toBe(400);
      });
    });

    describe('DELETE /articles/:id', () => {
      beforeEach(async () => {
        article = await prisma.article.create({
          data: {
            title: '제목',
            content: '내용',
            image: 'image1',
            user: {
              connect: { id: user.id },
            },
          },
        });
      });
      test('article 삭제 성공', async () => {
        const response = await agent.delete(`/articles/${article.id}`);
        expect(response.status).toBe(204);
        const articleData = await prisma.article.findUnique({
          where: { id: article.id },
        });
        expect(articleData).toBeNull();
      });
      test('article 삭제 실패(존재하지 않는 아이디)', async () => {
        const response = await agent.delete(`/articles/non-exist-id`);
        expect(response.status).toBe(400);
      });
    });

    describe('POST /articles/:id/comments', () => {
      beforeEach(async () => {
        article = await prisma.article.create({
          data: {
            title: '제목',
            content: '내용',
            image: 'image1',
            user: {
              connect: { id: user.id },
            },
          },
        });
      });
      test('article에 comment 작성 성공', async () => {
        const response = await agent
          .post(`/articles/${article.id}/comments`)
          .send({ content: '저요' });
        expect(response.status).toBe(201);
        expect(response.body.content).toBe('저요');
        expect(response.body.articleId).toBe(article.id);
      });

      test('article에 comment 작성 실패(없는 articleId)', async () => {
        const response = await agent
          .post(`/articles/non-exist-id/comments`)
          .send({ content: '저요' });
        expect(response.status).toBe(400);
      });
    });

    describe('GET /articles/:id/comments', () => {
      beforeAll(async () => {
        await clearCommentsWithReset(prisma);
        article = await prisma.article.create({
          data: {
            title: '제목',
            content: '내용',
            image: 'image1',
            user: {
              connect: { id: user.id },
            },
          },
        });

        for (let i = 0; i < 20; i++) {
          const comment = await prisma.comment.create({
            data: {
              content: `내용${i}`,
              user: {
                connect: { id: user.id },
              },
              article: {
                connect: { id: article.id },
              },
            },
          });
        }
      });
      test('article에 comment 조회 (전체)', async () => {
        const response = await agent.get(`/articles/${article.id}/comments`);
        expect(response.status).toBe(200);
        const { list, nextCursor } = response.body.result;
        expect(list.length).toBe(10);
        expect(list[0].content).toBe('내용0');
        expect(list[9].content).toBe('내용9');
        expect(nextCursor).toBe(11);
      });

      test('article에 comment 조회 (cursor)', async () => {
        const response = await agent
          .get(`/articles/${article.id}/comments`)
          .query({ cursor: 10 })
          .query({ limit: 5 });
        expect(response.status).toBe(200);
        const { list, nextCursor } = response.body.result;
        expect(list.length).toBe(5);
        expect(list[0].content).toBe('내용10');
        expect(nextCursor).toBe(16);
      });
    });

    describe('POST /articles/:id/likes', () => {
      beforeAll(async () => {
        article = await prisma.article.create({
          data: {
            title: '제목',
            content: '내용',
            image: 'image1',
            user: {
              connect: { id: user.id },
            },
          },
        });
      });
      test('article에 좋아요 완료', async () => {
        const response = await agent.post(`/articles/${article.id}/likes`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('좋아요가 추가되었습니다.');
      });

      test('article에 좋아요 취소', async () => {
        const response = await agent.post(`/articles/${article.id}/likes`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('좋아요가 취소되었습니다.');
      });
    });
  });
});
