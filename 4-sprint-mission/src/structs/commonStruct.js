import {
  coerce,
  integer,
  string,
  object,
  defaulted,
  optional,
  enums,
  nonempty,
} from "superstruct";

const integerString = coerce(integer(), string(), (value) => parseInt(value)); //coerce(목표타입, 입력타입, 변환 함수)

export const IdParamsStruct = object({
  id: integerString,
});

export const PageParamsStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 10),
  orderBy: optional(enums(["recent"])),
  keyword: optional(nonempty(string)),
});

export const CursorParamsStruct = object({
  cursor: defaulted(integerString, 0),
  limit: defaulted(integerString, 10),
  orderBy: optional(enums(["recent"])),
  keyword: optional(nonempty(string())),
});
