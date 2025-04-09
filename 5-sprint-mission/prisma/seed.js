import prisma from "../src/lib/prisma.js";
import { PRODUCTS, ARTICLES, USERS } from "./mock.js";

async function main() {
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: USERS,
    skipDuplicates: true,
  });

  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });

  await prisma.article.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
