import likeServices from '../services/likeServices';
import userService from '../services/userService';
import {
  CreateUserStruct,
  getUserParamsStruct,
  updateUserStruct,
  userStruct,
  cookieStruct,
  loginUserStruct,
} from '../structs/userStructs';
import { create } from 'superstruct';
import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../lib/errors/Unauthorized';
import { UserCreateData, userResponseDTO, userToken, UserUpdateData } from '../dto/userDTO';
import bcrypt from 'bcrypt';
import { REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';
import { verifyRefreshToken } from '../lib/token';

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<void>;

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
      if (error.message === '이메일이 이미 존재합니다.') {
        res.status(400).send({ error: error.message });
        return;
      }
    }
    return next(error);
  }
};

export const loginUser: Controller = async (req, res, next) => {
  try {
    const { email, password } = create(req.body, loginUserStruct);

    const user = await userService.findEmailForLogin(email);

    if (!user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const isPasswordValid = userService.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, 'refresh');

    const userUpdate: UserUpdateData = {
      id: user.id,
      refreshToken,
    };
    await userService.update(userUpdate);

    res.cookie('accessTokne', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.send('로그인 성공');
    return;
  } catch (error) {
    return next(error);
  }
};

export const getUser: Controller = async (req, res, next) => {
  try {
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
    const { page, pagesize, orderBy = 'recent' } = create(req.query, getUserParamsStruct);
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
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new BadRequestError('Invalid refresh token');
    }

    const { userId } = verifyRefreshToken(refreshToken);

    const user = await userService.getUserById(userId);
    if (!user) {
      throw new BadRequestError('Invalid refresh token');
    }

    const token = await userService.refreshToken(user.id, refreshToken);

    const TokenData: userToken = {
      id: user.id,
      refreshToken: token.newRefreshToken,
    };
    const accessToken = token.accessToken;

    await userService.update(TokenData);

    res.cookie('accesstoken', accessToken, {
      path: '/token/refresh',
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.cookie('refreshToken', TokenData.refreshToken, {
      path: '/token/refresh',
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.send('재발급 완료');
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
