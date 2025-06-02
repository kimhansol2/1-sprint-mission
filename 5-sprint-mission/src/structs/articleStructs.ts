import { string, object, nonempty, partial, nullable, optional } from 'superstruct';
import { PageParamsStruct } from './commonStruct';

export const GetArticleListParamsStruct = PageParamsStruct;

export const CreateArticleBodyStruct = object({
  title: nonempty(string()),
  content: nonempty(string()),
  image: optional(nullable(string())),
});

export const UpdateArticleBodyStruct = partial(CreateArticleBodyStruct);
