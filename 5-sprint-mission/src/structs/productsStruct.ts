import {
  coerce,
  partial,
  object,
  string,
  min,
  nonempty,
  array,
  integer,
} from "superstruct";
import { PageParamsStruct } from "./commonStruct";

export const CreateProductBodyStruct = object({
  name: coerce(nonempty(string()), string(), (value) => value.trim()),
  description: nonempty(string()),
  price: min(integer(), 0),
  tags: array(nonempty(string())),
  images: array(nonempty(string())),
});

export type CreateProduct = typeof CreateProductBodyStruct.type;

export const GetProductListParamsStruct = PageParamsStruct;

export type GetProduct = typeof GetProductListParamsStruct.type;

export const UpdateProductBodyStruct = partial(CreateProductBodyStruct);

export type UpdateProduct = typeof UpdateProductBodyStruct.type;
