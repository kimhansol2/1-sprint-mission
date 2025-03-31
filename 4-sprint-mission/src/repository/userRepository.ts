import prisma from "../lib/prisma.js";
import { User, Prisma } from "@prisma/client";

type UserCreateDet = Prisma.UserCreateInput;
type UserUpdateDet = Prisma.UserUpdateInput;

async function save({
  email,
  nickname,
  password,
}: UserCreateDet): Promise<User> {
  return prisma.user.create({
    data: {
      email,
      nickname,
      password,
    },
  });
}

async function findEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

async function findId(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

async function update(id: number, updatedField: UserUpdateDet): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: updatedField,
  });
}

export default {
  save,
  findEmail,
  findId,
  update,
};
