import { StructError } from "superstruct";
import BadRequestError from "../lib/errors/BadRequestError.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import UnauthorizedError from "../lib/errors/Unauthorized.js";
import { Request, Response, NextFunction } from "express";

export function defaultNotFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(404).send({ message: "Not found" });
}

export function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof StructError || err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }

  if (
    err instanceof SyntaxError ||
    (isBadRequestError(err) && err.status === 400)
  ) {
    return res.status(400).send({ message: "Invalid JSON" });
  }

  if (hasCode(err)) {
    console.error(err);
    return res.status(500).send({ message: "Failed to process data" });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).send({ message: err.message });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).send({ message: err.message });
  }

  console.error(err);
  return res.status(500).send({ message: "Internal server error" });
}

function isBadRequestError(err: unknown): err is BadRequestError {
  return err instanceof BadRequestError;
}

function hasCode(err: unknown): err is { code: string } {
  return typeof err === "object" && err !== null && "code" in err;
}
