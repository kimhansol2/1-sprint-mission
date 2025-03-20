import { create } from "superstruct";
import { prisma } from "../lib/prismaClient.js";
import { UpdateCommentBodyStruct } from "../structs/commentsStruct";
import NotFoundError from "../lib/errors/NotFoundError.js";
import { IdParamsStruct } from "../structs/commonStruct";

//.route("/:id").patch(asyncHandler(
export async function updateComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);

  const existingComment = await prisma.comment.findUniqe({ where: { id } });
  if (!existingComment) {
    throw new NotFoundError("comment", id);
  }

  const comment = await prisma.comment.update({
    where: { id },
    data: { content },
  });
  res.send(comment);
}

//.delete( asyncHandler(async
export async function deleteComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingComment = prisma.comment.findUniqe({ where: id });
  if (!existingComment) {
    throw new NotFoundError("comment", id);
  }

  await prisma.comment.delete({
    where: { id },
  });

  return res.status(204).send(); // 요청이 성공적으로 처리되면 no content를 보냄
}
