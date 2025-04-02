import { User as PrismaUser } from "@prisma/client";

export type User = PrismaUser;

export function userResponseDTO(user: Omit<User, "password" | "refreshToken">) {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export interface UserCreateData {
  email: string;
  password: string;
  nickname: string;
}

export interface UserUpdateData {
  id?: number;
  email?: string;
  nickname?: string;
  password?: string;
  image?: string;
  refreshToken?: string;
}

export interface TransformedUser {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  refreshToken: string | null;
}

export function userTransform(user: PrismaUser): TransformedUser {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    password: user.password,
    refreshToken: user.refreshToken ?? null,
  };
}
