import {
  object,
  string,
  nonempty,
  date,
  integer,
  nullable,
  optional,
  partial,
} from "superstruct";
import { PageParamsStruct } from "./commonStruct.js";

export const CreateUserStruct = object({
  email: nonempty(string()),
  nickname: nonempty(string()),
  password: nonempty(string()),
});

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

export const cookieStruct = object({
  refreshToken: string(),
});

export const getUserParamsStruct = PageParamsStruct;

export const updateUserStruct = partial(CreateUserStruct);
