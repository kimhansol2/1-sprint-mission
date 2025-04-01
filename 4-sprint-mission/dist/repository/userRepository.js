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
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
function save(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, nickname, password, }) {
        return prisma_js_1.default.user.create({
            data: {
                email,
                nickname,
                password,
            },
        });
    });
}
function findEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.user.findUnique({ where: { email } });
    });
}
function findId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.user.findUnique({ where: { id } });
    });
}
function update(id, updatedField) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.user.update({
            where: { id },
            data: updatedField,
        });
    });
}
exports.default = {
    save,
    findEmail,
    findId,
    update,
};
