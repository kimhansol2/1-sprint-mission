import {
  coerce,
  string,
  object,
  nonempty,
  partical,
  nullable,
} from "superstruct";
import { PageParamsStruct } from "./commonStruct";

export const GetArticleListParamsStruct = PageParamsStruct;

export const CreateArticleBodyStruct = object({
  title: coerce(nonempty(string())),
  content: nonempty(string()),
  image: nullable(string()),
});

export const UpdateArticleBodyStruct = partical(CreateArticleBodyStruct);
