import NotFoundError from "../lib/errors/NotFoundError.js";
import UnauthorizedError from "../lib/errors/Unauthorized.js";
import userRepository from "../repository/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function hashingPassword(password) {
  return bcrypt.hash(password, 10);
}

function createToken(user, type) {
  const payload = { userId: user.id };
  const options = {
    expiresIn: "1h",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  return token;
}

async function findEmail(email) {
  const existingUser = await userRepository.findEmail(email);
  console.log(existingUser);
  if (existingUser) {
    throw new Error("이메일이 이미 존재합니다.");
  }
}

async function create({ email, nickname, password }) {
  const hashedPassword = await hashingPassword(password);
  return userRepository.save({ email, nickname, password: hashedPassword });
}

async function getUser(email, password) {
  const user = await userRepository.findEmail(email);
  if (!user) {
    throw new UnauthorizedError(email);
  }

  await verifyPassword(password, user.password);

  return user;
}

async function verifyPassword(inputPassword, savedPassword) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    throw new UnauthorizedError(inputPassword);
  }
}

async function getUserById(id) {
  const user = await userRepository.findId(id);
  if (!user) {
    throw new NotFoundError(id);
  }
  return user;
}

export default {
  create,
  findEmail,
  getUser,
  createToken,
  getUserById,
};
