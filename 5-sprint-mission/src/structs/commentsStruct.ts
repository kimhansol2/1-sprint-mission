import { nonempty, object, partial, string } from 'superstruct';
import { CursorParamsStruct } from './commonStruct';

export const CreateCommentBodyStruct = object({
  content: nonempty(string()),
});

export type CreateCommentBody = typeof CreateCommentBodyStruct.type;

export const getCommentListParamsStruct = CursorParamsStruct;

export type GetCommentListParams = typeof getCommentListParamsStruct.type;

export const UpdateCommentBodyStruct = partial(CreateCommentBodyStruct);

export type UpdateCommentBody = typeof UpdateCommentBodyStruct.type;
