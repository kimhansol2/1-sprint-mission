import { create } from "superstruct";
import { UpdateCommentBodyStruct } from "../structs/commentsStruct.js";
import { IdParamsStruct } from "../structs/commonStruct.js";
import commentsService from "../services/commentsService.js";
import { Request, Response, NextFunction } from "express";

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

    const comment = await commentsService.update(id, content);
    res.send(comment);
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
