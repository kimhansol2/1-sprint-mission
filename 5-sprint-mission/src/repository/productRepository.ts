import prisma from '../lib/prisma.js';
import { Product } from '@prisma/client';
import { ProductCreateData, ProductUpdateData } from '../dto/productDTO.js';
import { ListQueryParams } from '../types/queryParams';

type ProductWithLike = Product & { ProductLike: { userId: number }[] };

export async function savedata(productData: ProductCreateData): Promise<Product> {
  return prisma.product.create({ data: productData });
}

export async function listdata(params: ListQueryParams): Promise<ProductWithLike[]> {
  const { userId, page, pagesize, orderBy, keyword, likedOnly } = params;

  return prisma.product.findMany({
    skip: (page - 1) * pagesize,
    take: pagesize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: {
      ...(keyword && {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }),
      ...(likedOnly && userId && { ProductLike: { some: { userId } } }),
    },
    include: {
      ProductLike: userId
        ? {
            where: { userId: userId },
            select: { userId: true },
          }
        : false,
    },
  });
}

export async function countdata(
  keyword?: string,
  likedOnly: boolean = false,
  userId?: number,
): Promise<number> {
  return prisma.product.count({
    where: {
      ...(keyword && {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }),
      ...(likedOnly && userId && { ProductLike: { some: { userId } } }),
    },
  });
}

export async function getByIdData(id: number): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id },
  });
}

export async function updateData(productData: ProductUpdateData): Promise<Product> {
  const { id, tags, images, ...data } = productData;
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      tags: tags ? { set: tags as string[] } : undefined,
      images: images ? { set: images as string[] } : undefined,
    },
  });
}

export async function deleteIdData(id: number): Promise<Product> {
  return prisma.product.delete({
    where: { id },
  });
}

export async function userProduct(
  id: number,
  { page, pagesize, orderBy }: { page: number; pagesize: number; orderBy: 'recent' | 'id' },
) {
  return prisma.product.findMany({
    where: { userId: id },
    skip: (page - 1) * pagesize,
    take: pagesize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
  });
}
