"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStruct = exports.getUserParamsStruct = exports.cookieStruct = exports.userStruct = exports.CreateUserStruct = void 0;
const superstruct_1 = require("superstruct");
const commonStruct_1 = require("./commonStruct");
exports.CreateUserStruct = (0, superstruct_1.object)({
    email: (0, superstruct_1.nonempty)((0, superstruct_1.string)()),
    nickname: (0, superstruct_1.nonempty)((0, superstruct_1.string)()),
    password: (0, superstruct_1.nonempty)((0, superstruct_1.string)()),
});
exports.userStruct = (0, superstruct_1.object)({
    id: (0, superstruct_1.integer)(),
    email: (0, superstruct_1.string)(),
    nickname: (0, superstruct_1.string)(),
    image: (0, superstruct_1.nullable)((0, superstruct_1.string)()),
    password: (0, superstruct_1.optional)((0, superstruct_1.string)()),
    refreshToken: (0, superstruct_1.optional)((0, superstruct_1.string)()),
    createdAt: (0, superstruct_1.date)(),
    updatedAt: (0, superstruct_1.date)(),
});
exports.cookieStruct = (0, superstruct_1.object)({
    refreshToken: (0, superstruct_1.string)(),
});
exports.getUserParamsStruct = commonStruct_1.PageParamsStruct;
exports.updateUserStruct = (0, superstruct_1.partial)(exports.CreateUserStruct);
