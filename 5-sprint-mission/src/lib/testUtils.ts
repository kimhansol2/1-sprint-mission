import { PrismaClient } from '@prisma/client';

export async function clearDatabase(prismaClient: PrismaClient) {
  await prismaClient.$executeRawUnsafe(
    `TRUNCATE TABLE
      "Comment",
      "ProductLike",
      "ArticleLike",
      "Product",
      "Article",
      "User",
      "Notification"
      RESTART IDENTITY CASCADE;  
      `,
  );
}

export async function clearCommentsWithReset(prismaClient: PrismaClient) {
  await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE "Comment" RESTART IDENTITY CASCADE`);
}

export async function clearProductsWithReset(prismaClient: PrismaClient) {
  await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`);
}
