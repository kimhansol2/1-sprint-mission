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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundError_js_1 = __importDefault(require("../lib/errors/NotFoundError.js"));
const Unauthorized_js_1 = __importDefault(require("../lib/errors/Unauthorized.js"));
const productRepository_js_1 = __importDefault(require("../repository/productRepository.js"));
const userRepository_js_1 = __importDefault(require("../repository/userRepository.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function hashingPassword(password) {
    return bcrypt_1.default.hash(password, 10);
}
function createToken(user, type) {
    const payload = { userId: user.id };
    const options = {
        expiresIn: type === "refresh" ? "2w" : "1h",
    };
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined ");
    }
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, options);
    return token;
}
function findEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield userRepository_js_1.default.findEmail(email);
        console.log(existingUser);
        if (existingUser) {
            throw new Error("이메일이 이미 존재합니다.");
        }
    });
}
function create(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, nickname, password }) {
        const hashedPassword = yield hashingPassword(password);
        const user = yield userRepository_js_1.default.save({
            email,
            nickname,
            password: hashedPassword,
        });
        return filterSensitiveUserData(user);
    });
}
function getUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_js_1.default.findEmail(email);
        if (!user) {
            throw new Unauthorized_js_1.default("Unauthorized");
        }
        yield verifyPassword(password, user.password);
        return user;
    });
}
function verifyPassword(inputPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isValid = yield bcrypt_1.default.compare(inputPassword, savedPassword);
        if (!isValid) {
            throw new Unauthorized_js_1.default("Unauthorized");
        }
    });
}
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_js_1.default.findId(id);
        if (!user) {
            throw new NotFoundError_js_1.default("NotFound");
        }
        return filterSensitiveUserData(user);
    });
}
function update(id_1, _a) {
    return __awaiter(this, arguments, void 0, function* (id, { email, nickname, password, refreshToken }) {
        const updatedField = {};
        if (email !== undefined)
            updatedField.email = email;
        if (nickname !== undefined)
            updatedField.nickname = nickname;
        if (password !== undefined)
            updatedField.password = yield hashingPassword(password);
        if (refreshToken !== undefined)
            updatedField.refreshToken = refreshToken;
        const user = yield userRepository_js_1.default.update(id, updatedField);
        return filterSensitiveUserData(user);
    });
}
function getProductList(id_1, _a) {
    return __awaiter(this, arguments, void 0, function* (id, { page, pagesize, orderBy = "recent" }) {
        page = page > 0 ? page : 1;
        pagesize = pagesize > 0 ? pagesize : 10;
        return productRepository_js_1.default.userProduct(id, {
            page,
            pagesize,
            orderBy,
        });
    });
}
function refreshToken(id, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_js_1.default.findId(id);
        if (!user || user.refreshToken !== refreshToken) {
            throw new Unauthorized_js_1.default("Unauthorized");
        }
        const accessToken = createToken(user);
        const newRefreshToken = createToken(user, "refresh");
        return { accessToken, newRefreshToken };
    });
}
function filterSensitiveUserData(user) {
    const { password, refreshToken } = user, rest = __rest(user, ["password", "refreshToken"]);
    return rest;
}
exports.default = {
    create,
    findEmail,
    getUser,
    createToken,
    getUserById,
    update,
    getProductList,
    refreshToken,
};
