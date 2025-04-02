import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/Unauthorized.js';
import productRepository from '../repository/productRepository.js';
import userRepository from '../repository/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserCreateData, UserUpdateData, TransformedUser } from '../dto/userDTO.js';

interface getProductList {
  page: number;
  pagesize: number;
  orderBy: 'recent' | 'id';
}

function hashingPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

function createToken(user: TransformedUser, type?: 'refresh'): string {
  const payload = { userId: user.id };
  const options: jwt.SignOptions = {
    expiresIn: type === 'refresh' ? '2w' : '1h',
  };

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined ');
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  return token;
}

async function findEmail(email: string) {
  const existingUser = await userRepository.findEmail(email);
  if (existingUser) {
    throw new Error('이메일이 이미 존재합니다.');
  }
}

async function findEmailForLogin(email: string) {
  const existingUser = await userRepository.findEmail(email);
  return existingUser;
}

async function create(userData: UserCreateData) {
  const { password } = userData;
  const hashedPassword = await hashingPassword(password);

  const userUpdateData: UserCreateData = {
    ...userData,
    password: hashedPassword,
  };
  const user = await userRepository.save(userUpdateData);
  return filterSensitiveUserData(user);
}

async function getUser(email: string, password: string) {
  const user = await userRepository.findEmail(email);
  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }

  await verifyPassword(password, user.password);

  return user;
}

export async function verifyPassword(inputPassword: string, savedPassword: string) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    throw new UnauthorizedError('Unauthorized');
  }
}

async function getUserById(id: number) {
  const user = await userRepository.findId(id);
  if (!user) {
    throw new NotFoundError('NotFound');
  }
  return filterSensitiveUserData(user);
}

async function update(userUpate: UserUpdateData) {
  const { id, email, nickname, password, refreshToken } = userUpate;

  const updatedField: UserUpdateData = { id };
  if (email !== undefined) updatedField.email = email;
  if (nickname !== undefined) updatedField.nickname = nickname;
  if (password !== undefined) updatedField.password = await hashingPassword(password);
  if (refreshToken !== undefined) updatedField.refreshToken = refreshToken;

  const user = await userRepository.update(updatedField);

  return filterSensitiveUserData(user);
}

async function getProductList(id: number, { page, pagesize, orderBy = 'recent' }: getProductList) {
  page = page > 0 ? page : 1;
  pagesize = pagesize > 0 ? pagesize : 10;
  return productRepository.userProduct(id, {
    page,
    pagesize,
    orderBy,
  });
}

async function refreshToken(id: number, refreshToken: string) {
  const user = await userRepository.findId(id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new UnauthorizedError('Unauthorized');
  }
  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, 'refresh');
  return { accessToken, newRefreshToken };
}

function filterSensitiveUserData(user: User) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

export default {
  create,
  findEmail,
  getUser,
  createToken,
  getUserById,
  update,
  getProductList,
  refreshToken,
  verifyPassword,
  findEmailForLogin,
};
