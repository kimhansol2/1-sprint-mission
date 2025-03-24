import userService from "../services/userService.js";

export async function createUser(req, res, next) {
  try {
    const { email, nickname, password } = req.body;
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
    const user = req.user;
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");

    await userService.update(user.id, { refreshToken });

    return res.json({ accessToken });
  } catch (error) {
    return next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = req.user.id;
    const result = await userService.getUserById(user);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = req.user.id;
    const { email, nickname, image, password } = req.body;
    const result = await userService.update(user, {
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
    const user = req.user.id;
    const { page, pagesize, orderBy } = req.query;
    const result = await userService.getProductList(user, {
      page,
      pagesize,
      orderBy,
    });

    res.json(result);
  } catch (error) {
    return next(error);
  }
}
