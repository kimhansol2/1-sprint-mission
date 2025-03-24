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

export async function createUser(req, res, next) {
  try {
    const { email, nickname, password } = create(req.body, CreateUserStruct);
    await userService.findEmail(email);
    const data = await userService.create({ email, nickname, password });
    res.status(201).send({ data });
  } catch (error) {
    if (error.message === "이메일이 이미 존재합니다.") {
      return res.status(400).send({ error: error.message });
    }

    return next(error);
  }
}

export async function loginUser(req, res, next) {
  try {
    const user = create(req.user, userStruct);
    console.log(user);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");

    await userService.update(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ accessToken });
  } catch (error) {
    return next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    //안됨
    console.log(req.user);
    const user = create(req.user, userStruct);
    const result = await userService.getUserById(user.id);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = create(req.user, userStruct);
    const { email, nickname, image, password } = create(
      req.body,
      updateUserStruct
    );
    const result = await userService.update(user.id, {
      email,
      nickname,
      image,
      password,
    });

    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function userProductList(req, res, next) {
  try {
    const user = create(req.user, userStruct);
    const { page, pagesize, orderBy } = create(req.query, getUserParamsStruct);
    const result = await userService.getProductList(user.id, {
      page,
      pagesize,
      orderBy,
    });

    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function userNewToken(req, res, next) {
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

    return res.json({ accessToken });
  } catch (error) {
    return next(error);
  }
}

export async function likeProducts(req, res, next) {
  try {
    const user = create(req.user, userStruct);
    const { page, pagesize } = create(req.query, getUserParamsStruct);
    const result = await likeServices.productLikedList(user.id, page, pagesize);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}
