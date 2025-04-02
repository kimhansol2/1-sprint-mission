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
const prisma_1 = __importDefault(require("../lib/prisma"));
function save(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.article.create({ data });
    });
}
function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.article.findUnique({ where: { id } });
    });
}
function countArticle(keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.default.article.count({
            where: keyword ? { title: { contains: keyword } } : undefined,
        });
    });
}
function findArticle(userId, page, pagesize, orderBy, keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.article.findMany({
            skip: (page - 1) * pagesize,
            take: pagesize,
            orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
            where: keyword ? { title: { contains: keyword } } : undefined,
            include: {
                ArticleLike: {
                    where: { userId: userId },
                    select: { isLiked: true },
                },
            },
        });
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.default.article.update({ where: { id }, data });
    });
}
function deleteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.default.article.delete({ where: { id } });
    });
}
exports.default = {
    save,
    findById,
    countArticle,
    findArticle,
    update,
    deleteById,
};
