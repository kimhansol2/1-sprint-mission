import { productLikedList } from '../services/likeServices';
import {
  isExistEmail,
  save,
  findEmailForLogin,
  verifyPassword,
  createToken,
  update,
  getUserById,
  getProductList,
  refreshToken,
} from '../services/userService';
import {
  CreateUserStruct,
  getUserParamsStruct,
  updateUserStruct,
  userStruct,
  loginUserStruct,
  notificationStruct,
} from '../structs/userStructs';
import { create } from 'superstruct';
import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../lib/errors/Unauthorized';
import { UserCreateData, userResponseDTO, userToken, UserUpdateData } from '../dto/userDTO';
import { REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';
import { verifyRefreshToken } from '../lib/token';
import { findNotification } from '../services/notificationService';
import { IdParamsStruct } from '../structs/commonStruct';
import NotFoundError from 'lib/errors/NotFoundError';

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const createUser: Controller = async (req, res) => {
  const { email, nickname, password } = create(req.body, CreateUserStruct);
  const isExist = await isExistEmail(email);

  if (isExist) {
    res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    return;
  }

  const userData: UserCreateData = {
    email,
    nickname,
    password,
  };

  const user = await save(userData);
  res.status(201).send(userResponseDTO(user));
  return;
};

export const loginUser: Controller = async (req, res) => {
  const { email, password } = create(req.body, loginUserStruct);

  const user = await findEmailForLogin(email);

  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }
  await verifyPassword(password, user.password);

  const accessToken = createToken(user);
  const refreshToken = createToken(user, 'refresh');

  const userUpdate: UserUpdateData = {
    id: user.id,
    refreshToken,
  };
  await update(userUpdate);

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
  });

  res.json({ message: '로그인 성공' });
  return;
};

export const getUser: Controller = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const user = await getUserById(id);
  res.json(userResponseDTO(user));
  return;
};

export const updateUser: Controller = async (req, res) => {
  const users = create(req.user, userStruct);
  const data = create(req.body, updateUserStruct);

  const updateData: UserUpdateData = {
    id: users.id,
    ...data,
  };
  const user = await update(updateData);

  res.json(userResponseDTO(user));
  return;
};

export const userProductList: Controller = async (req, res) => {
  const user = create(req.params, IdParamsStruct);
  const { page, pagesize, orderBy = 'recent' } = create(req.query, getUserParamsStruct);
  const result = await getProductList(user.id, {
    page,
    pagesize,
    orderBy,
  });

  res.json(result);
  return;
};

export const userNewToken: Controller = async (req, res) => {
  const refreshTokens = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshTokens) {
    throw new BadRequestError('Invalid refresh token');
  }

  const { userId } = verifyRefreshToken(refreshTokens);

  const user = await getUserById(userId);

  const token = await refreshToken(user.id, refreshTokens);

  const TokenData: userToken = {
    id: user.id,
    refreshToken: token.newRefreshToken,
  };
  const accessToken = token.accessToken;

  await update(TokenData);

  res.cookie('accessToken', accessToken, {
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
};

export const likeProducts: Controller = async (req, res) => {
  const user = create(req.user, userStruct);
  const { page, pagesize } = create(req.query, getUserParamsStruct);
  const result = await productLikedList(user.id, page, pagesize);
  res.json(result);
  return;
};

export const myNotification: Controller = async (req, res) => {
  const user = create(req.user, userStruct);
  const { read } = create(req.query, notificationStruct);

  const onlyUnread = read === false;

  const result = await findNotification(user!.id, onlyUnread);

  res.status(200).json(result);
  return;
};
