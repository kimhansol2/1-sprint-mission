-- AlterTable
ALTER TABLE "ArticleLike" ADD COLUMN     "isLiked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProductLike" ADD COLUMN     "isLiked" BOOLEAN NOT NULL DEFAULT false;
