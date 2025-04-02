import commentsRepository from "../repository/commentsRepository.js";
import NotFoundError from "../lib/errors/NotFoundError.js";

async function findById(id) {
  const existingComment = await commentsRepository.findById(id);
  if (!existingComment) {
    throw new NotFoundError("article", id);
  }
  return existingComment;
}

async function update(id, content) {
  return commentsRepository.update(id, content);
}

async function deleteId(id) {
  return commentsRepository.deleteId(id);
}

export default {
  findById,
  update,
  deleteId,
};
