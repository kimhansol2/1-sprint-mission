import { string, object, nonempty, partial, nullable } from 'superstruct';
import { PageParamsStruct } from './commonStruct';

export const GetArticleListParamsStruct = PageParamsStruct;

export const CreateArticleBodyStruct = object({
  title: nonempty(string()),
  content: nonempty(string()),
  image: nullable(string()),
});

export const UpdateArticleBodyStruct = partial(CreateArticleBodyStruct);
