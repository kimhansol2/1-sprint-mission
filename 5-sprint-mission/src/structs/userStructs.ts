import {
  object,
  string,
  nonempty,
  date,
  integer,
  nullable,
  optional,
  partial,
  boolean,
  coerce,
} from 'superstruct';
import { PageParamsStruct } from './commonStruct';

export const CreateUserStruct = object({
  email: nonempty(string()),
  nickname: nonempty(string()),
  password: nonempty(string()),
  image: optional(string()),
});

export const loginUserStruct = object({
  email: nonempty(string()),
  password: nonempty(string()),
});

export type CreateUser = typeof CreateUserStruct.type;

export const userStruct = object({
  id: integer(),
  email: string(),
  nickname: string(),
  image: nullable(string()),
  password: optional(string()),
  refreshToken: optional(string()),
  createdAt: date(),
  updatedAt: date(),
});

export type User = typeof userStruct.type;

export const cookieStruct = object({
  refreshToken: string(),
});

export type Cookie = typeof cookieStruct.type;

export const getUserParamsStruct = PageParamsStruct;

export type GetUserParams = typeof getUserParamsStruct.type;

export const updateUserStruct = partial(CreateUserStruct);

export type UpdateUser = typeof updateUserStruct.type;

const BooleanQuery = coerce(boolean(), string(), (val) => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return undefined;
});

export const notificationStruct = object({
  read: optional(BooleanQuery),
});
