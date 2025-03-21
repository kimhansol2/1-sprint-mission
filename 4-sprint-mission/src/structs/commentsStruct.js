import { nonempty, object, partial, string } from "superstruct";
import { CursorParamsStruct } from "./commonStruct.js";

export const CreateCommentBodyStruct = object({
  content: nonempty(string()),
});

export const getCommentListParamsStruct = CursorParamsStruct;
export const UpdateCommentBodyStruct = partial(CreateCommentBodyStruct);
