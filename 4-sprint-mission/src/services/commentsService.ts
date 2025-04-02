import commentsRepository from "../repository/commentsRepository.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import { commnetupdatedata } from "../dto/commentDTO";

async function findById(id: number) {
  const existingComment = await commentsRepository.findById(id);
  if (!existingComment) {
    throw new NotFoundError("Not Found");
  }
  return existingComment;
}

async function update(commentdata: commnetupdatedata) {
  return commentsRepository.update(commentdata);
}

async function deleteId(id: number) {
  return commentsRepository.deleteId(id);
}

export default {
  findById,
  update,
  deleteId,
};
