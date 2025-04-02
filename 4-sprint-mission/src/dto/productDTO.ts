import { Product as PrismaProduct } from "@prisma/client";

export type Product = PrismaProduct;

export function productResponseDTO(product: Product) {
  return {
    name: product.name,
    id: product.id,
    description: product.description,
    price: product.price,
    tags: product.tags,
    images: product.images,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    userId: product.userId,
  };
}

export interface ProductCreateData {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: number;
}

export interface ProductUpdateData {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
}
