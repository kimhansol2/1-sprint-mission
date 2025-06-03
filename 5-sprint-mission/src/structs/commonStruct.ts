import {
  coerce,
  integer,
  string,
  object,
  defaulted,
  optional,
  enums,
  nonempty,
  boolean,
} from 'superstruct';

const integerString = coerce(integer(), string(), (value: string) => parseInt(value)); //coerce(목표타입, 입력타입, 변환 함수)

export const IdParamsStruct = object({
  id: integerString,
});

export type IdParams = typeof IdParamsStruct.type;

export const PageParamsStruct = object({
  page: defaulted(integerString, 1),
  pagesize: defaulted(integerString, 10),
  orderBy: defaulted(enums(['recent', 'id'] as const), 'recent'),
  keyword: optional(nonempty(string())),
  likedOnly: optional(coerce(boolean(), string(), (value) => value === 'true')),
});

export type PageParams = typeof PageParamsStruct.type;

export const CursorParamsStruct = object({
  cursor: defaulted(integerString, 0),
  limit: defaulted(integerString, 10),
  orderBy: optional(enums(['recent'] as const)),
  keyword: optional(nonempty(string())),
});

export type CursorParams = typeof CursorParamsStruct.type;
