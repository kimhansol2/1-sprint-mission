import { ListQueryParams } from 'types/queryParams';
import * as productRepository from '../repository/productRepository';
import * as productService from './productService';
import NotFoundError from '../lib/errors/NotFoundError';
import * as notificationService from './notificationService';
import * as commentsRepository from '../repository/commentsRepository';

jest.mock('../repository/productRepository');
jest.mock('../repository/commentsRepository');

describe('상품 서비스', () => {
  const mockProduct = {
    id: 1,
    name: '하얀색 티셔츠',
    description: '반팔 티셔츠',
    price: 10000,
    tags: ['TSHIRT'],
    images: ['https://example.com/image1.jpg'],
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    likeCount: 0,
    isLiked: false,
    ProductLike: [],
  };

  const updatedProduct = {
    ...mockProduct,
    name: '변경된 상품',
    price: 20000,
  };

  const mockProducts = [
    {
      id: 1,
      name: '상품1',
      description: '설명',
      price: 5000,
      tags: ['tag1'],
      images: ['img1.jpg'],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      ProductLike: [{ userId: 1 }],
    },
    {
      id: 2,
      name: '상품2',
      description: '설명2',
      price: 7000,
      tags: ['tag2'],
      images: ['img2.jpg'],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      ProductLike: [],
    },
  ];

  const mockComment = {
    id: 1,
    content: '댓글입니다.',
    userId: 1,
    productId: 1,
    articleId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(notificationService, 'notifyPriceChanged').mockImplementation(jest.fn());
  });

  describe('productService.save 테스트', () => {
    test('상품을 생성할 수 있다.', async () => {
      jest.mocked(productRepository.savedata).mockResolvedValue(mockProduct);

      const result = await productService.save({
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price,
        tags: mockProduct.tags,
        images: mockProduct.images,
        userId: mockProduct.userId,
      });

      expect(productRepository.savedata).toHaveBeenCalled();
      expect(result).toMatchObject({
        ...mockProduct,
        likeCount: 0,
        isLiked: false,
      });
    });

    test('상품 생성을 실패 할 수 있다.', async () => {
      jest.mocked(productRepository.savedata).mockResolvedValue(null as any);

      await expect(
        productService.save({
          name: mockProduct.name,
          description: mockProduct.description,
          price: mockProduct.price,
          tags: mockProduct.tags,
          images: mockProduct.images,
          userId: mockProduct.userId,
        }),
      ).rejects.toThrow('product 생성 실패');

      expect(productRepository.savedata).toHaveBeenCalled();
    });
  });

  describe('productService.list', () => {
    const mockParams: ListQueryParams = {
      keyword: '',
      likedOnly: false,
      page: 1,
      pagesize: 10,
      orderBy: 'recent',
    };

    test('비로그인 유저는 isLiked가 항상 false이고 productLike는 undefined 처리된다.', async () => {
      jest.mocked(productRepository.countdata).mockResolvedValue(2);
      jest.mocked(productRepository.listdata).mockResolvedValue(mockProducts);

      const result = await productService.list(null, mockParams);

      expect(result.totalCount).toBe(2);
      expect(result.list).toEqual([
        {
          ...mockProducts[0],
          isLiked: false,
          ProductLike: undefined,
        },
        {
          ...mockProducts[1],
          isLiked: false,
          ProductLike: undefined,
        },
      ]);
    });

    test('로그인 유저는 productLike에 따라 isLiked가 true 또는 false로 처리된다.', async () => {
      jest.mocked(productRepository.countdata).mockResolvedValue(2);
      jest.mocked(productRepository.listdata).mockResolvedValue(mockProducts);

      const result = await productService.list(1, mockParams);

      expect(result.list[0].isLiked).toBe(true);
      expect(result.list[1].isLiked).toBe(false);
    });
  });

  describe('productService.getById', () => {
    test('정상적으로 상품을 조회할 수 있다.', async () => {
      jest.mocked(productRepository.getByIdData).mockResolvedValue(mockProduct);

      const result = await productService.getById(1);

      expect(productRepository.getByIdData).toHaveBeenCalledWith(1);
      expect(result).toBe(mockProduct);
    });

    test('상품이 존재하지 않으면 NotFoundError를 던진다.', async () => {
      jest.mocked(productRepository.getByIdData).mockResolvedValue(null);

      await expect(productService.getById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('productService.update', () => {
    test('가격이 변경되면 notifyPriceChanged가 호출된다.', async () => {
      jest.mocked(productRepository.getByIdData).mockResolvedValue(mockProduct);
      jest.mocked(productRepository.updateData).mockResolvedValue(updatedProduct);

      const result = await productService.update({
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        tags: updatedProduct.tags,
        images: updatedProduct.images,
      });

      expect(notificationService.notifyPriceChanged).toHaveBeenCalledWith(
        updatedProduct.id,
        updatedProduct.price,
      );
      expect(result).toEqual(updatedProduct);
    });

    test('가격 동일 notifyPriceChanged 미호출.', async () => {
      const sameProduct = { ...mockProduct };

      jest.mocked(productRepository.getByIdData).mockResolvedValue(mockProduct);
      jest.mocked(productRepository.updateData).mockResolvedValue(sameProduct);

      await productService.update({
        id: sameProduct.id,
        name: sameProduct.name,
        description: sameProduct.description,
        price: sameProduct.price,
        tags: sameProduct.tags,
        images: sameProduct.images,
      });

      expect(notificationService.notifyPriceChanged).not.toHaveBeenCalled();
    });
  });
  describe('productService.delete', () => {
    test('상품 제거 완료', async () => {
      jest.mocked(productRepository.deleteIdData).mockResolvedValue(undefined);

      await expect(productService.deleteId(1)).resolves.toBeUndefined();
    });
  });

  describe('productService.commentProduct', () => {
    test('상품 댓글 작성 성공', async () => {
      jest.mocked(commentsRepository.commentProductData).mockResolvedValue(mockComment);

      const result = await productService.commentProduct({
        content: mockComment.content,
        userId: mockComment.userId,
        productId: mockComment.productId,
      });

      expect(result).toEqual(mockComment);
    });
  });

  describe('productService.findCommentsByProduct', () => {
    test('상품 댓글 조회를 성공할 수 있다.', async () => {
      const cursor = 0;
      const limit = 5;
      jest.mocked(commentsRepository.findCommentsByProductData).mockResolvedValue([mockComment]);

      const result = await productService.findCommentsByProduct(1, cursor, limit);
      expect(result).toEqual({
        list: [mockComment],
        nextCursor: null,
      });
    });

    test('댓글이 limit보다 작으면 nextCursor는 null이다.', async () => {
      const cursor = 0;
      const limit = 5;

      jest.mocked(commentsRepository.findCommentsByProductData).mockResolvedValue([mockComment]);

      const result = await productService.findCommentsByProduct(1, cursor, limit);

      expect(result).toEqual({
        list: [mockComment],
        nextCursor: null,
      });
    });
  });
});
