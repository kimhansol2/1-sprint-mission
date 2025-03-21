import { create } from "superstruct";
import { UpdateCommentBodyStruct } from "../structs/commentsStruct";
import { IdParamsStruct } from "../structs/commonStruct";
import commentsService from "../services/commentsService.js";

//.route("/:id").patch(asyncHandler(
export async function updateComment(req, res, next) {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, UpdateCommentBodyStruct);

    await commentsService.findById(id);

    const comment = await commentsService.update(id, content);
    res.send(comment);
  } catch (error) {
    next(error);
  }
}

//.delete( asyncHandler(async
export async function deleteComment(req, res, next) {
  try {
    const { id } = create(req.params, IdParamsStruct);

    await commentsService.findById(id);

    await commentsService.deleteId(id);

    return res.status(204).send(); // 요청이 성공적으로 처리되면 no content를 보냄
  } catch (error) {
    next(error);
  }
}
