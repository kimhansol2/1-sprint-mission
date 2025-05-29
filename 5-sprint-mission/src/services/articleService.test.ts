import * as articlesRepository from '../repository/articleRepository';
import * as articlesService from './articleService';

jest.mock('../repository/articleRepository');

describe('게스글 서비스', () => {
  const mockArticle = {
    id: 1,
    title: 'Test Article',
    content: 'Test Content',
    image: 'test.jpg',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    likeCount: 0,
    isLiked: false,
    ArticleLike: [],
  };

  const mockComment = {
    id: 10,
    content: '댓글입니다.',
    userId: 2,
    articleId: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createArticle', () => {
    test('게시글을 생성할 수 있다.', async () => {
      jest.mocked(articlesRepository.savedata).mockResolvedValue(mockArticle);

      const result = await articlesService.save({
        title: mockArticle.title,
        content: mockArticle.content,
        image: mockArticle.image,
        userId: mockArticle.userId,
      });

      expect(articlesRepository.savedata).toHaveBeenCalled();
      expect(result).toMatchObject({
        ...mockArticle,
        likeCount: 0,
        isLiked: false,
      });
    });
  });

  describe('getById', () => {
    test('게시글 목록을 조회할 수 있다.', async () => {
      jest.mocked(articlesRepository.countArticle).mockResolvedValue(20);
      jest.mocked(articlesRepository.findArticle).mockResolvedValue([mockArticle]);

      const result = await articlesService.getList({ page: 1, pagesize: 10, orderBy: 'recent' });

      expect(articlesRepository.countArticle).toHaveBeenCalled();
      expect(articlesRepository.findArticle).toHaveBeenCalled();
      expect(result.list.length).toBe(1);
      expect(result.totalCount).toBe(20);
      expect(result.list[0].isLiked).toBe(false);
    });
  });
});
