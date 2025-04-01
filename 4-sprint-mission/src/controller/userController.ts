import likeServices from "../services/likeServices.js";
import userService from "../services/userService.js";
import {
  CreateUserStruct,
  getUserParamsStruct,
  updateUserStruct,
  userStruct,
  cookieStruct,
} from "../structs/userStructs.js";
import { create } from "superstruct";
import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../lib/errors/Unauthorized.js";

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const createUser: Controller = async (req, res, next) => {
  try {
    const { email, nickname, password } = create(req.body, CreateUserStruct);
    await userService.findEmail(email);
    const data = await userService.create({ email, nickname, password });
    res.status(201).send({ data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "이메일이 이미 존재합니다.") {
        res.status(400).send({ error: error.message });
        return;
      }
    }
    return next(error);
  }
};

function assertUserHasPassword(user: {
  password?: string | undefined;
}): asserts user is { password: string } {
  if (!user.password) {
    throw new UnauthorizedError("Unauthorized");
  }
}

export const loginUser: Controller = async (req, res, next) => {
  try {
    const user = create(req.user, userStruct);

    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    assertUserHasPassword(user);

    const transformedUser = {
      ...user,
      refreshToken: user.refreshToken ?? null,
    };

    console.log(user);
    const accessToken = userService.createToken(transformedUser);
    const refreshToken = userService.createToken(transformedUser, "refresh");

    await userService.update(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json({ accessToken });
    return;
  } catch (error) {
    return next(error);
  }
};

export const getUser: Controller = async (req, res, next) => {
  try {
    console.log(req.user);
    const user = create(req.user, userStruct);
    const result = await userService.getUserById(user.id);
    res.json(result);
  } catch (error) {
    return next(error);
  }
};

export const updateUser: Controller = async (req, res, next) => {
  try {
    const user = create(req.user, userStruct);
    const { email, nickname, password } = create(req.body, updateUserStruct);
    const result = await userService.update(user.id, {
      email,
      nickname,
      password,
    });

    res.json(result);
  } catch (error) {
    return next(error);
  }
};

export const userProductList: Controller = async (req, res, next) => {
  try {
    const user = create(req.user, userStruct);
    const { page, pagesize, orderBy } = create(req.query, getUserParamsStruct);
    const result = await userService.getProductList(user.id, {
      page,
      pagesize,
      orderBy: "recent",
    });

    res.json(result);
  } catch (error) {
    return next(error);
  }
};

export const userNewToken: Controller = async (req, res, next) => {
  try {
    const { refreshToken } = create(req.cookies, cookieStruct);
    const { id } = create(req.user, userStruct);
    console.log("id테스트", id);

    const { accessToken, newRefreshToken } = await userService.refreshToken(
      id,
      refreshToken
    );

    await userService.update(id, { refreshToken: newRefreshToken });
    res.cookie("refreshToken", newRefreshToken, {
      path: "/token/refresh",
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.json({ accessToken });
    return;
  } catch (error) {
    return next(error);
  }
};

export const likeProducts: Controller = async (req, res, next) => {
  try {
    const user = create(req.user, userStruct);
    const { page, pagesize } = create(req.query, getUserParamsStruct);
    const result = await likeServices.productLikedList(user.id, page, pagesize);
    res.json(result);
    return;
  } catch (error) {
    return next(error);
  }
};
