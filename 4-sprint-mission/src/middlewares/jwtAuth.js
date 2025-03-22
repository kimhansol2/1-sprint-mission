import UnauthorizedError from "../lib/errors/Unauthorized.js";
import productRepository from "../repository/productRepository.js";
import articleRepository from "../repository/articleRepository.js";
import NotFoundError from "../lib/errors/NotFoundError.js";

export async function verifyproductAuth(req, res, next) {
  console.log("req.user:", req.user);
  const id = parseInt(req.params.id, 10);
  try {
    const product = await productRepository.getById(id);

    if (!product) {
      throw new NotFoundError(product);
    }

    if (product.userId !== req.user.id) {
      throw new UnauthorizedError(product);
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export async function verifyarticleAuth(req, res, next) {
  const id = parseInt(req.params.id, 10);

  try {
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError(article);
    }
    if (article.userId !== req.user.id) {
      throw new UnauthorizedError(article);
    }
    return next();
  } catch (error) {
    return next(error);
  }
}
