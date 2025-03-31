import { Prisma, User as PrismaUser } from "@prisma/client";

export type User = PrismaUser;

export type UserCreateData = {
  email: string;
  password: string;
  nickname: string;
};

export type UserUpdateData = {
  email?: string;
  nickname?: string;
  password?: string;
  image?: string;
  refreshToken?: string;
};
