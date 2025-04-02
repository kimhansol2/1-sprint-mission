import prisma from "../lib/prisma.js";
import { User, Prisma } from "@prisma/client";
import { UserCreateData, UserUpdateData } from "../dto/userDTO.js";

async function save(userUpdateData: UserCreateData): Promise<User> {
  return prisma.user.create({
    data: {
      ...userUpdateData,
    },
  });
}

async function findEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

async function findId(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

async function update(updatedField: UserUpdateData): Promise<User> {
  const { id, ...updatedata } = updatedField;
  return prisma.user.update({
    where: { id },
    data: updatedata,
  });
}

export default {
  save,
  findEmail,
  findId,
  update,
};
