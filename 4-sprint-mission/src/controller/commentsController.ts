import { create } from "superstruct";
import { UpdateCommentBodyStruct } from "../structs/commentsStruct";
import { IdParamsStruct } from "../structs/commonStruct";
import commentsService from "../services/commentsService";
import { Request, Response, NextFunction } from "express";
import { commnetupdatedata, commentResponseDTO } from "../dto/commentDTO";

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const updateComment: Controller = async (req, res, next) => {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const { content = "" } = create(req.body, UpdateCommentBodyStruct);

    await commentsService.findById(id);

    const commentdata: commnetupdatedata = {
      id,
      content,
    };

    const comment = await commentsService.update(commentdata);
    res.send(commentResponseDTO(comment));
  } catch (error) {
    return next(error);
  }
};

export const deleteComment: Controller = async (req, res, next) => {
  try {
    const { id } = create(req.params, IdParamsStruct);

    await commentsService.findById(id);

    await commentsService.deleteId(id);

    res.status(204).send();
    return; // 요청이 성공적으로 처리되면 no content를 보냄
  } catch (error) {
    return next(error);
  }
};
