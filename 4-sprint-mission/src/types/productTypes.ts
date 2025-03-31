import { Prisma, Product as PrismaProduct } from "@prisma/client";

export type Product = PrismaProduct;

export type ProductCreateData = {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: number;
};

export type ProductUpdateData = {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
};
