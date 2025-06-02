import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/Unauthorized';
import { userProduct } from '../repository/productRepository';
import { findEmail, savedata, findId, updatedata } from '../repository/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserCreateData, UserUpdateData, TransformedUser } from '../dto/userDTO';

interface getProductList {
  page: number;
  pagesize: number;
  orderBy: 'recent' | 'id';
}

export function hashingPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function createToken(user: TransformedUser, type?: 'refresh'): string {
  const payload = { userId: user.id };
  const secret =
    type === 'refresh' ? process.env.JWT_REFRESH_TOKEN_SECRET : process.env.JWT_ACCESS_TOKEN_SECRET;

  const options: jwt.SignOptions = {
    expiresIn: type === 'refresh' ? '2w' : '1h',
  };

  if (!secret) {
    throw new Error('token is not defined ');
  }

  const token = jwt.sign(payload, secret, options);

  return token;
}

export async function isExistEmail(email: string) {
  const existingUser = await findEmail(email);
  return existingUser !== null;
}

export async function findEmailForLogin(email: string) {
  const existingUser = await findEmail(email);
  return existingUser;
}

export async function save(userData: UserCreateData) {
  const { password } = userData;
  const hashedPassword = await hashingPassword(password);

  const userUpdateData: UserCreateData = {
    ...userData,
    password: hashedPassword,
  };
  const user = await savedata(userUpdateData);
  return filterSensitiveUserData(user);
}

export async function getUser(email: string, password: string) {
  const user = await findEmail(email);
  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }

  await verifyPassword(password, user.password);

  return user;
}

export async function verifyPassword(inputPassword: string, savedPassword: string) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  return isValid;
}

export async function getUserById(id: number) {
  const user = await findId(id);
  if (!user) {
    throw new NotFoundError('NotFound');
  }
  return filterSensitiveUserData(user);
}

export async function update(userUpate: UserUpdateData) {
  const { id, email, nickname, password, refreshToken } = userUpate;

  const updatedField: UserUpdateData = { id };
  if (email !== undefined) updatedField.email = email;
  if (nickname !== undefined) updatedField.nickname = nickname;
  if (password !== undefined) updatedField.password = await hashingPassword(password);
  if (refreshToken !== undefined) updatedField.refreshToken = refreshToken;

  const user = await updatedata(updatedField);

  return filterSensitiveUserData(user);
}

export async function getProductList(
  id: number,
  { page, pagesize, orderBy = 'recent' }: getProductList,
) {
  page = page > 0 ? page : 1;
  pagesize = pagesize > 0 ? pagesize : 10;
  return userProduct(id, {
    page,
    pagesize,
    orderBy,
  });
}

export async function refreshToken(id: number, refreshToken: string) {
  const user = await findId(id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new UnauthorizedError('Unauthorized');
  }
  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, 'refresh');
  return { accessToken, newRefreshToken };
}

export function filterSensitiveUserData(user: User) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}
