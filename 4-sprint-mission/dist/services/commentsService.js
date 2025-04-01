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
const commentsRepository_js_1 = __importDefault(require("../repository/commentsRepository.js"));
const NotFoundError_js_1 = __importDefault(require("../lib/errors/NotFoundError.js"));
function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingComment = yield commentsRepository_js_1.default.findById(id);
        if (!existingComment) {
            throw new NotFoundError_js_1.default("Not Found");
        }
        return existingComment;
    });
}
function update(id, content) {
    return __awaiter(this, void 0, void 0, function* () {
        return commentsRepository_js_1.default.update(id, content);
    });
}
function deleteId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return commentsRepository_js_1.default.deleteId(id);
    });
}
exports.default = {
    findById,
    update,
    deleteId,
};
