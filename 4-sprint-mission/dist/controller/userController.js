"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeProducts = exports.userNewToken = exports.userProductList = exports.updateUser = exports.getUser = exports.loginUser = exports.createUser = void 0;
const likeServices_js_1 = __importDefault(require("../services/likeServices.js"));
const userService_js_1 = __importDefault(require("../services/userService.js"));
const userStructs_js_1 = require("../structs/userStructs.js");
const superstruct_1 = require("superstruct");
const Unauthorized_js_1 = __importDefault(require("../lib/errors/Unauthorized.js"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, nickname, password } = (0, superstruct_1.create)(req.body, userStructs_js_1.CreateUserStruct);
        yield userService_js_1.default.findEmail(email);
        const data = yield userService_js_1.default.create({ email, nickname, password });
        res.status(201).send({ data });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "이메일이 이미 존재합니다.") {
                res.status(400).send({ error: error.message });
                return;
            }
        }
        return next(error);
    }
});
exports.createUser = createUser;
function assertUserHasPassword(user) {
    if (!user.password) {
        throw new Unauthorized_js_1.default("Unauthorized");
    }
}
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = (0, superstruct_1.create)(req.user, userStructs_js_1.userStruct);
        if (!user) {
            throw new Unauthorized_js_1.default("Unauthorized");
        }
        assertUserHasPassword(user);
        const transformedUser = Object.assign(Object.assign({}, user), { refreshToken: (_a = user.refreshToken) !== null && _a !== void 0 ? _a : null });
        console.log(user);
        const accessToken = userService_js_1.default.createToken(transformedUser);
        const refreshToken = userService_js_1.default.createToken(transformedUser, "refresh");
        yield userService_js_1.default.update(user.id, { refreshToken });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        res.json({ accessToken });
        return;
    }
    catch (error) {
        return next(error);
    }
});
exports.loginUser = loginUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.user);
        const user = (0, superstruct_1.create)(req.user, userStructs_js_1.userStruct);
        const result = yield userService_js_1.default.getUserById(user.id);
        res.json(result);
    }
    catch (error) {
        return next(error);
    }
});
exports.getUser = getUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (0, superstruct_1.create)(req.user, userStructs_js_1.userStruct);
        const { email, nickname, password } = (0, superstruct_1.create)(req.body, userStructs_js_1.updateUserStruct);
        const result = yield userService_js_1.default.update(user.id, {
            email,
            nickname,
            password,
        });
        res.json(result);
    }
    catch (error) {
        return next(error);
    }
});
exports.updateUser = updateUser;
const userProductList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (0, superstruct_1.create)(req.user, userStructs_js_1.userStruct);
        const { page, pagesize, orderBy } = (0, superstruct_1.create)(req.query, userStructs_js_1.getUserParamsStruct);
        const result = yield userService_js_1.default.getProductList(user.id, {
            page,
            pagesize,
            orderBy: "recent",
        });
        res.json(result);
    }
    catch (error) {
        return next(error);
    }
});
exports.userProductList = userProductList;
const userNewToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = (0, superstruct_1.create)(req.cookies, userStructs_js_1.cookieStruct);
        const { id } = (0, superstruct_1.create)(req.user, userStructs_js_1.userStruct);
        console.log("id테스트", id);
        const { accessToken, newRefreshToken } = yield userService_js_1.default.refreshToken(id, refreshToken);
        yield userService_js_1.default.update(id, { refreshToken: newRefreshToken });
        res.cookie("refreshToken", newRefreshToken, {
            path: "/token/refresh",
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        res.json({ accessToken });
        return;
    }
    catch (error) {
        return next(error);
    }
});
exports.userNewToken = userNewToken;
const likeProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (0, superstruct_1.create)(req.user, userStructs_js_1.userStruct);
        const { page, pagesize } = (0, superstruct_1.create)(req.query, userStructs_js_1.getUserParamsStruct);
        const result = yield likeServices_js_1.default.productLikedList(user.id, page, pagesize);
        res.json(result);
        return;
    }
    catch (error) {
        return next(error);
    }
});
exports.likeProducts = likeProducts;
