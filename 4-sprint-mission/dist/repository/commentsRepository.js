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
function findCommentsByArticle(articleId, cursor, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.comment.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            take: limit,
            where: { articleId },
            orderBy: { createdAt: "desc" },
        });
    });
}
function findCommentsByProduct(productId, cursor, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.comment.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            take: limit,
            where: { productId },
            orderBy: { createdAt: "desc" },
        });
    });
}
function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.comment.findUnique({ where: { id } });
    });
}
function update(id, content) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.comment.update({
            where: { id },
            data: { content },
        });
    });
}
function deleteId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.comment.delete({
            where: { id },
        });
    });
}
function commentArticle(articleId, content, user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_js_1.default.comment.create({
            data: {
                content,
                article: { connect: { id: articleId } },
                user: { connect: { id: user } },
            },
        });
    });
}
function commentProduct(productId, content, user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_js_1.default.comment.create({
            data: {
                content,
                product: { connect: { id: productId } },
                user: { connect: { id: user } },
            },
        });
    });
}
exports.default = {
    findCommentsByArticle,
    findById,
    update,
    deleteId,
    findCommentsByProduct,
    commentArticle,
    commentProduct,
};
