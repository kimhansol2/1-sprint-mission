"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const localStratedy_1 = __importDefault(require("./passport/localStratedy"));
const jwtStrategy_1 = __importDefault(require("./passport/jwtStrategy"));
passport_1.default.use("local", localStratedy_1.default);
passport_1.default.use("accessToken", jwtStrategy_1.default);
exports.default = passport_1.default;
