import { updatedata, findById, deleteId } from '../repository/commentsRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { commnetupdatedata } from '../dto/commentDTO';

export async function findByIdData(id: number) {
  const existingComment = await findById(id);
  if (!existingComment) {
    throw new NotFoundError('Not Found');
  }
  return existingComment;
}

export async function update(commentdata: commnetupdatedata) {
  return updatedata(commentdata);
}

export async function deleteIdData(id: number) {
  return deleteId(id);
}
