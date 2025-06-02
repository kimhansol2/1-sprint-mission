import { create } from 'superstruct';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct';
import { IdParamsStruct } from '../structs/commonStruct';
import { findByIdData, update, deleteIdData } from '../services/commentsService';
import { Request, Response, NextFunction } from 'express';
import { commnetupdatedata, commentResponseDTO } from '../dto/commentDTO';

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const updateComment: Controller = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const { content = '' } = create(req.body, UpdateCommentBodyStruct);

  await findByIdData(id);

  const commentdata: commnetupdatedata = {
    id,
    content,
  };

  const comment = await update(commentdata);
  res.send(commentResponseDTO(comment));
};

export const deleteComment: Controller = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);

  await findByIdData(id);

  await deleteIdData(id);

  res.status(204).send();
  return;
};
