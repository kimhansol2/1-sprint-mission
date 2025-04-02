/*
  Warnings:

  - You are about to drop the `Article_Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product_Comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article_Comment" DROP CONSTRAINT "Article_Comment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Product_Comment" DROP CONSTRAINT "Product_Comment_productId_fkey";

-- DropTable
DROP TABLE "Article_Comment";

-- DropTable
DROP TABLE "Product_Comment";

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "articleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
