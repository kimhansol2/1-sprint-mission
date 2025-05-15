import prisma from '../lib/prisma';
import { User, Prisma } from '@prisma/client';
import { UserCreateData, UserUpdateData } from '../dto/userDTO';

export async function savedata(userUpdateData: UserCreateData): Promise<User> {
  return prisma.user.create({
    data: {
      ...userUpdateData,
    },
  });
}

export async function findEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function findId(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function updatedata(updatedField: UserUpdateData): Promise<User> {
  const { id, ...updatedata } = updatedField;
  return prisma.user.update({
    where: { id },
    data: updatedata,
  });
}
