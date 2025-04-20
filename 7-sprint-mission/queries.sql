/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
 UPDATE "user" SET nickname = 'test' WHERE id =1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
 SELECT * FROM product WHERE userId = 1 ORDER BY createdAt DESC LIMIT 10 OFFSET 20;

/*
  3. 내가 생성한 상품의 총 개수
*/

SELECT COUNT(*) FROM product WHERE userId =1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT * FROM product_like WHERE userId = 1 ORDER BY createdAt DESC LIMIT 10 OFFSET 20;

/*
  5. 내가 좋아요 누른 상품의 총 개수
*/
SELECT count(*) FROM product_like WHERE userId = 1;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO product(userId,name,description,price) values(1,'pen','이것은 내가 만든 펜이다',2000);

/*
  7. 상품 목록 조회
  - "test" 로 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT p.*, count(p1.id) as like_count
FROM product p
LEFT OUTER JOIN product_like p1 ON p1.productId = p.id
WHERE p.name ILIKE '%test%'
GROUP BY p.id
ORDER BY p.createdAt DESC
LIMIT 10;
/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/

SELECT * FROM product WHERE id =1;


/*
  9. 상품 수정
  - 1번 상품 수정
*/
UPDATE product SET name = 'kimhansol' WHERE id =1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM product WHERE id =1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO product_like(productId, userId) values(2,1);
 
/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM product_like WHERE productId = 2 AND userId =1;

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO comment (productId, articleId, content, userId) VALUES (2, NULL, '이 상품 정말 마음에 들어요!' ,1);

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준으로 커서 페이지네이션
  - 10개씩 페이지네이션
*/

SELECT * FROM comment
WHERE productId = 1
AND createdAt < '2025-03-25 00:00:00'
ORDER BY createdAt DESC
LIMIT 10;

