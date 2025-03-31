import commentsRepository from "../repository/commentsRepository.js";
import NotFoundError from "../lib/errors/NotFoundError.js";

async function findById(id: number) {
  const existingComment = await commentsRepository.findById(id);
  if (!existingComment) {
    throw new NotFoundError("Not Found");
  }
  return existingComment;
}

async function update(id: number, content: string) {
  return commentsRepository.update(id, content);
}

async function deleteId(id: number) {
  return commentsRepository.deleteId(id);
}

export default {
  findById,
  update,
  deleteId,
};
