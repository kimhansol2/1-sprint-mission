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
function productLike(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, productId, }) {
        return prisma_js_1.default.productLike.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
    });
}
function productLikeCancel(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, productId, }) {
        return prisma_js_1.default.productLike.delete({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
    });
}
function prouductLikeCreate(_a, isLiked_1) {
    return __awaiter(this, arguments, void 0, function* ({ userId, productId }, isLiked) {
        return prisma_js_1.default.productLike.create({
            data: {
                userId,
                productId,
                isLiked: isLiked,
            },
        });
    });
}
function articleLike(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, articleId, }) {
        return prisma_js_1.default.articleLike.findUnique({
            where: {
                userId_articleId: {
                    userId,
                    articleId,
                },
            },
        });
    });
}
function articleLikeCancel(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, articleId, }) {
        return prisma_js_1.default.articleLike.delete({
            where: {
                userId_articleId: {
                    userId,
                    articleId,
                },
            },
        });
    });
}
function articleLikeCreate(_a, isLiked_1) {
    return __awaiter(this, arguments, void 0, function* ({ userId, articleId }, isLiked) {
        return prisma_js_1.default.articleLike.create({
            data: {
                userId,
                articleId,
                isLiked: isLiked,
            },
        });
    });
}
function findLikedProducts(id, page, pagesize) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.productLike.findMany({
            where: {
                userId: id,
                isLiked: true,
            },
            skip: (page - 1) * pagesize,
            take: pagesize,
            include: {
                product: true,
            },
        });
    });
}
exports.default = {
    productLike,
    productLikeCancel,
    prouductLikeCreate,
    articleLike,
    articleLikeCancel,
    articleLikeCreate,
    findLikedProducts,
};
