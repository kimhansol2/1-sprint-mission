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
const likeRepository_js_1 = __importDefault(require("../repository/likeRepository.js"));
function likeProductFind(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, productId }) {
        const existingLike = yield likeRepository_js_1.default.productLike({ userId, productId });
        if (existingLike) {
            yield likeRepository_js_1.default.productLikeCancel({ userId, productId });
            return { message: "좋아요가 취소되었습니다." };
        }
        else {
            yield likeRepository_js_1.default.prouductLikeCreate({ userId, productId }, true);
            return { message: "좋아요가 추가되었습니다." };
        }
    });
}
function likeArticleFind(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, articleId }) {
        const existingLike = yield likeRepository_js_1.default.articleLike({ userId, articleId });
        if (existingLike) {
            yield likeRepository_js_1.default.articleLikeCancel({ userId, articleId });
            return { message: "좋아요가 취소되었습니다." };
        }
        else {
            yield likeRepository_js_1.default.articleLikeCreate({ userId, articleId }, true);
            return { message: "좋아요가 추가되었습니다." };
        }
    });
}
function productLikedList(id, page, pagesize) {
    return __awaiter(this, void 0, void 0, function* () {
        page = page > 0 ? page : 1;
        pagesize = pagesize > 1 ? pagesize : 10;
        return likeRepository_js_1.default.findLikedProducts(id, page, pagesize);
    });
}
exports.default = {
    likeProductFind,
    likeArticleFind,
    productLikedList,
};
