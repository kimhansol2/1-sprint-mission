import NotFoundError from "../lib/errors/NotFoundError.js";
import articleRepository from "../repository/articleRepository.js";
import productRepository from "../repository/productRepository.js";
import userRepository from "../repository/userRepository.js";
import { expressjwt } from "express-jwt";

function throwUnauthorizedError() {
  const error = new Error("Unauthorized");
  error.code = 401;
  throw error;
}

async function verifySessionLogin(req, res, next) {
  try {
    const { userId } = req.session;

    if (!userId) {
      console.log("사용자를 찾을 수 없음");
      throwUnauthorizedError();
    }

    const user = await userRepository.findId(req.session.userId);

    if (!user) {
      throwUnauthorizedError();
    }

    req.user = {
      id: req.session.userId,
      email: user.email,
      name: user.name,
    };

    console.log("인증된 사용자 정보:", req.user);
    next();
  } catch (error) {
    next(error);
  }
}

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
  getToken: (req) => req.cookies.refreshToken,
});

async function verifyProductAuth(req, res, next) {
  const id = parseInt(req.params.id);
  try {
    const product = await productRepository.getById(id);

    if (!product) {
      throw new NotFoundError(product);
    }

    if (product.userId !== req.user.id) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

async function verifyArticleAuth(req, res, next) {
  const id = parseInt(req.params.id);
  try {
    const article = await articleRepository.findById(id);

    if (!article) {
      throw new NotFoundError(article);
    }

    if (article.userId !== req.user.id) {
      const error = new Error("forbidden");
      error.code = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export default {
  verifySessionLogin,
  verifyProductAuth,
  verifyArticleAuth,
  verifyAccessToken,
  verifyRefreshToken,
};
