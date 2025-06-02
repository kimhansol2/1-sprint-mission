/*
  Warnings:

  - You are about to drop the column `isLiked` on the `ArticleLike` table. All the data in the column will be lost.
  - You are about to drop the column `isLiked` on the `ProductLike` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArticleLike" DROP COLUMN "isLiked",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ProductLike" DROP COLUMN "isLiked",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
