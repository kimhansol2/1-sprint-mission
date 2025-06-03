import request from 'supertest';
import app from '../app';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import { clearDatabase, clearProductsWithReset } from '../lib/testUtils';
import { User, Product } from '@prisma/client';

describe('상품 API 테스트', () => {
  let user: User;
  beforeAll(async () => {
    await clearDatabase(prisma);
    let hashed = await bcrypt.hash('password1234', 10);
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
    describe('GET /products', () => {
      beforeAll(async () => {
        for (let i = 0; i < 20; i++) {
          await prisma.product.create({
            data: {
              name: `하얀색 티셔츠${i}`,
              description: `반팔로 된 좋은 티셔츠${i}`,
              price: 1000 * i,
              tags: ['TSHIRT'],
              images: ['https://example.com/image1.jpg'],
              user: {
                connect: { id: user.id },
              },
            },
          });
        }
      });

      test('모든 product 조회 성공', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.list[0]).toMatchObject({
          name: `하얀색 티셔츠19`,
          description: `반팔로 된 좋은 티셔츠19`,
          price: 19000,
          tags: ['TSHIRT'],
          images: ['https://example.com/image1.jpg'],
        });
        expect(response.body.list.length).toBe(10);
        expect(response.body.totalCount).toBe(20);
      });

      test('product 일부 조회 성공(page)', async () => {
        const response = await request(app).get('/products').query({ page: 2 });
        expect(response.status).toBe(200);
        expect(response.body.list[0]).toMatchObject({
          name: `하얀색 티셔츠9`,
          description: `반팔로 된 좋은 티셔츠9`,
          price: 9000,
          tags: ['TSHIRT'],
          images: ['https://example.com/image1.jpg'],
        });
      });
      test('product 일부 조회 성공(pagesize)', async () => {
        const response = await request(app).get('/products').query({ pagesize: 5 });
        expect(response.status).toBe(200);
        expect(response.body.list[0]).toMatchObject({
          name: `하얀색 티셔츠19`,
          description: `반팔로 된 좋은 티셔츠19`,
          price: 19000,
          tags: ['TSHIRT'],
          images: ['https://example.com/image1.jpg'],
        });
        expect(response.body.list[5]).toBe(undefined);
      });
      test('product 일부 조회 성공(orderBy)', async () => {
        const response = await request(app).get('/products').query({ orderBy: 'id' });
        expect(response.status).toBe(200);
        expect(response.body.list[0]).toMatchObject({
          name: `하얀색 티셔츠0`,
          description: `반팔로 된 좋은 티셔츠0`,
          price: 0,
          tags: ['TSHIRT'],
          images: ['https://example.com/image1.jpg'],
        });
        expect(response.body.list[9]).toMatchObject({
          name: `하얀색 티셔츠9`,
          description: `반팔로 된 좋은 티셔츠9`,
          price: 9000,
          tags: ['TSHIRT'],
          images: ['https://example.com/image1.jpg'],
        });
      });
      test('product 일부 조회 성공(keyword)', async () => {
        const response = await request(app).get('/products').query({ keyword: '티셔츠15' });
        expect(response.status).toBe(200);
        expect(response.body.list[0]).toMatchObject({
          name: `하얀색 티셔츠15`,
          description: `반팔로 된 좋은 티셔츠15`,
          price: 15000,
          tags: ['TSHIRT'],
          images: ['https://example.com/image1.jpg'],
        });
      });
    });

    describe('GET /products/:id', () => {
      let productId: Product;
      beforeAll(async () => {
        await clearProductsWithReset(prisma);
        const product = await prisma.product.create({
          data: {
            name: `하얀색 티셔츠`,
            description: `반팔로 된 좋은 티셔츠`,
            price: 1000,
            tags: ['TSHIRT'],
            images: ['https://example.com/image1.jpg'],
            user: {
              connect: { id: user.id },
            },
          },
        });
        productId = product;
      });

      test('product 아이디 조회 성공', async () => {
        const response = await request(app).get(`/products/${productId.id}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(productId.id);
      });

      test('product 아이디 조회 실패', async () => {
        const response = await request(app).get(`/products/non-exist-id`);
        expect(response.status).toBe(400);
        expect(response.body.id).toBe(undefined);
      });
    });
  });

  describe('인증이 필요한 API', () => {
    const agent = request.agent(app);
    beforeAll(async () => {
      const res = await agent.post('/users/login').send({
        email: 'test@example.com',
        password: 'password1234',
      });
      expect(res.status).toBe(200);
    });
    describe('POST /products', () => {
      test('product 생성 테스트(전체항목)', async () => {
        await clearProductsWithReset(prisma);
        const response = await agent.post('/products').send({
          name: `검정색 반팔티`,
          description: `반팔로 된 좋은 티셔츠`,
          price: 20000,
          tags: ['TSHIRT'],
          images: ['https://example.com/image1.jpg'],
        });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          name: `검정색 반팔티`,
          description: `반팔로 된 좋은 티셔츠`,
          price: 20000,
          tags: ['TSHIRT'],
          images: ['https://example.com/image1.jpg'],
        });
      });

      test('product 생성 테스트 (생성 실패)', async () => {
        const response = await agent.post('/products').send({
          name: `검정색 반팔티`,
        });
        expect(response.status).toBe(400);
      });
    });
    describe('GET /products', () => {
      let likedProductId: number;
      beforeAll(async () => {
        const product = await prisma.product.findFirst({
          where: { name: '검정색 반팔티' },
        });
        likedProductId = product!.id;

        await prisma.productLike.create({
          data: {
            userId: user.id,
            productId: likedProductId,
          },
        });
      });
      test('product 조회 테스트 (좋아요 표시)', async () => {
        const response = await agent.get('/products').query({ likedOnly: true });
        expect(response.status).toBe(200);
        expect(response.body.list[0].id).toBe(likedProductId);
        expect(response.body.list[0].isLiked).toBe(true);
      });
    });
    describe('PATCH /products/:id', () => {
      let productId: number;
      beforeAll(async () => {
        await clearProductsWithReset(prisma);
        const product = await prisma.product.create({
          data: {
            name: `빨간색 티셔츠`,
            description: `반팔로 된 좋은 티셔츠`,
            price: 1000,
            tags: ['TSHIRT'],
            images: ['https://example.com/image1.jpg'],
            user: {
              connect: { id: user.id },
            },
          },
        });
        productId = product.id;
      });
      test('product 수정 테스트 (전체 수정)', async () => {
        const response = await agent.patch(`/products/${productId}`).send({
          name: `파란색 티셔츠`,
          description: `긴 팔로 된 좋은 티셔츠`,
          price: 2000,
          tags: ['SHIRT'],
          images: ['https://example.com/image2.jpg'],
        });
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(productId);
        expect(response.body.price).toBe(2000);
      });
      test('product 수정 테스트 (일부 수정)', async () => {
        const response = await agent.patch(`/products/${productId}`).send({
          name: `흰색 티셔츠`,
        });
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(productId);
        expect(response.body).toMatchObject({
          name: `흰색 티셔츠`,
          description: `긴 팔로 된 좋은 티셔츠`,
          price: 2000,
          tags: ['SHIRT'],
          images: ['https://example.com/image2.jpg'],
        });
      });
      test('product 수정 실패 테스트)', async () => {
        const response = await agent.patch(`/products/3`).send({
          name: `흰색 티셔츠`,
        });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('NotFound');
      });
    });

    describe('DELTE /products/:id', () => {
      let productId: number;
      beforeAll(async () => {
        await clearProductsWithReset(prisma);
        const product = await prisma.product.create({
          data: {
            name: `빨간색 티셔츠`,
            description: `반팔로 된 좋은 티셔츠`,
            price: 1000,
            tags: ['TSHIRT'],
            images: ['https://example.com/image1.jpg'],
            user: {
              connect: { id: user.id },
            },
          },
        });
        productId = product.id;
      });
      test('product 삭제 성공 테스트)', async () => {
        const response = await agent.delete(`/products/${productId}`);
        expect(response.status).toBe(204);
        const productData = await prisma.product.findUnique({
          where: { id: productId },
        });
        expect(productData).toBeNull();
      });
      test('product 삭제 실패 테스트)', async () => {
        const response = await agent.delete(`/products/non-exist-id`);
        expect(response.status).toBe(400);
      });
    });

    describe('POST /products/:id/comments', () => {
      let productId: number;
      beforeAll(async () => {
        await clearProductsWithReset(prisma);
        const product = await prisma.product.create({
          data: {
            name: `빨간색 티셔츠`,
            description: `반팔로 된 좋은 티셔츠`,
            price: 1000,
            tags: ['TSHIRT'],
            images: ['https://example.com/image1.jpg'],
            user: {
              connect: { id: user.id },
            },
          },
        });
        productId = product.id;
      });
      test('product 댓글 성공 테스트)', async () => {
        const response = await agent.post(`/products/${productId}/comments`).send({
          content: '내용',
        });
        expect(response.status).toBe(201);
        expect(response.body.content).toBe('내용');
      });
      test('product 댓글 실패 테스트)', async () => {
        const response = await agent.delete(`/products/non-exist-id/comments`);
        expect(response.status).toBe(404);
      });
    });

    describe('POST /products/:id/comments', () => {
      let productId: number;
      beforeAll(async () => {
        await clearProductsWithReset(prisma);
        const product = await prisma.product.create({
          data: {
            name: `빨간색 티셔츠`,
            description: `반팔로 된 좋은 티셔츠`,
            price: 1000,
            tags: ['TSHIRT'],
            images: ['https://example.com/image1.jpg'],
            user: {
              connect: { id: user.id },
            },
          },
        });
        productId = product.id;

        for (let i = 0; i < 20; i++) {
          const comment = await prisma.comment.create({
            data: {
              content: `내용${i}`,
              user: {
                connect: { id: user.id },
              },
              createdAt: new Date(Date.now() + i),
              product: {
                connect: { id: productId },
              },
            },
          });
        }
      });
      test('product의 Comments 조회)', async () => {
        const response = await agent.get(`/products/${productId}/comments`);
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(10);
        expect(response.body.list[0].content).toBe('내용19');
        expect(response.body.list[9].content).toBe('내용10');
      });
      test('product 댓글 실패 테스트)', async () => {
        const response = await agent.delete(`/products/non-exist-id/comments`);
        expect(response.status).toBe(404);
      });
    });

    describe('POST /products/:id/likes', () => {
      let productId: number;
      beforeAll(async () => {
        await clearProductsWithReset(prisma);
        const product = await prisma.product.create({
          data: {
            name: `빨간색 티셔츠`,
            description: `반팔로 된 좋은 티셔츠`,
            price: 1000,
            tags: ['TSHIRT'],
            images: ['https://example.com/image1.jpg'],
            user: {
              connect: { id: user.id },
            },
          },
        });
        productId = product.id;
      });
      test('product 좋아요 테스트)', async () => {
        const response = await agent.post(`/products/${productId}/likes`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('좋아요가 추가되었습니다.');
      });
      test('product 좋아요 취소 테스트)', async () => {
        const response = await agent.post(`/products/${productId}/likes`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('좋아요가 취소되었습니다.');
      });
    });
  });
});
