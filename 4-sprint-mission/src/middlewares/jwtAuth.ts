import UnauthorizedError from "../lib/errors/Unauthorized";
import productRepository from "../repository/productRepository";
import articleRepository from "../repository/articleRepository";
import NotFoundError from "../lib/errors/NotFoundError";
import commentsRepository from "../repository/commentsRepository";
import userRepository from "../repository/userRepository";
import { Request, Response, NextFunction } from "express";

export async function verifyproductAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id, 10);
  try {
    if (!req.user) {
      return next(new UnauthorizedError("Unauthorized"));
    }
    const product = await productRepository.getById(id);

    if (!product) {
      throw new NotFoundError("NotFound");
    }

    if (product.userId !== req.user.id) {
      throw new UnauthorizedError("Unauthorized");
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export async function verifyarticleAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id, 10);

  try {
    if (!req.user) {
      return next(new UnauthorizedError("Unauthorized"));
    }
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError("NotFound");
    }
    if (article.userId !== req.user.id) {
      throw new UnauthorizedError("Unauthorized");
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function verifycommentAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(new UnauthorizedError("Unauthorized"));
  }
  const id = parseInt(req.params.id, 10);
  try {
    const comment = await commentsRepository.findById(id);

    if (!comment) {
      throw new NotFoundError("NotFound");
    }
    if (comment.userId !== req.user.id) {
      throw new UnauthorizedError("Unauthorized");
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export async function verifyuserAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id, 10);
  try {
    if (!req.user) {
      return next(new UnauthorizedError("Unauthorized"));
    }
    const user = await userRepository.findId(id);
    if (!user) {
      throw new NotFoundError("NotFound");
    }

    if (user.id !== req.user?.id) {
      throw new UnauthorizedError("Unauthorized");
    }
    return next();
  } catch (error) {
    return next(error);
  }
}
