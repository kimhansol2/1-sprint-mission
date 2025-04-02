import likeServices from "../services/likeServices";
import userService from "../services/userService";
import {
  CreateUserStruct,
  getUserParamsStruct,
  updateUserStruct,
  userStruct,
  cookieStruct,
} from "../structs/userStructs";
import { create } from "superstruct";
import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../lib/errors/Unauthorized";
import {
  UserCreateData,
  userResponseDTO,
  TransformedUser,
  UserUpdateData,
} from "../dto/userDTO";

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const createUser: Controller = async (req, res, next) => {
  try {
    const { email, nickname, password } = create(req.body, CreateUserStruct);
    await userService.findEmail(email);
    const userData: UserCreateData = {
      email,
      nickname,
      password,
    };

    const user = await userService.create(userData);
    res.status(201).send(userResponseDTO(user));
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
    const user = create(req.user as Express.User, userStruct);

    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    assertUserHasPassword(user);

    const transformedUser: TransformedUser = {
      ...user,
      refreshToken: user.refreshToken ?? null,
    };

    console.log(user);
    const accessToken = userService.createToken(transformedUser);
    const refreshToken = userService.createToken(transformedUser, "refresh");

    const userUpdate: UserUpdateData = {
      id: user.id,
      refreshToken,
    };
    await userService.update(userUpdate);
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
    const users = create(req.user, userStruct);
    const user = await userService.getUserById(users.id);
    res.json(userResponseDTO(user));
  } catch (error) {
    return next(error);
  }
};

export const updateUser: Controller = async (req, res, next) => {
  try {
    const users = create(req.user, userStruct);
    const data = create(req.body, updateUserStruct);

    const updateData: UserUpdateData = {
      id: users.id,
      ...data,
    };
    const user = await userService.update(updateData);

    res.json(userResponseDTO(user));
  } catch (error) {
    return next(error);
  }
};

export const userProductList: Controller = async (req, res, next) => {
  try {
    const user = create(req.user, userStruct);
    const {
      page,
      pagesize,
      orderBy = "recent",
    } = create(req.query, getUserParamsStruct);
    const result = await userService.getProductList(user.id, {
      page,
      pagesize,
      orderBy,
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

    const token = await userService.refreshToken(id, refreshToken);

    const TokenData = {
      id,
      refreshToken: token.newRefreshToken,
    };
    const accessToken = token.accessToken;

    await userService.update(TokenData);
    res.cookie("refreshToken", TokenData.refreshToken, {
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
