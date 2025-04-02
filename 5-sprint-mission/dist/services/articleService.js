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
const articleRepository_1 = __importDefault(require("../repository/articleRepository"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const commentsRepository_1 = __importDefault(require("../repository/commentsRepository"));
function create(article) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield articleRepository_1.default.save(article);
    });
}
function getList(userId_1, _a) {
    return __awaiter(this, arguments, void 0, function* (userId, { page, pagesize, orderBy = "recent", keyword }) {
        const totalCount = yield articleRepository_1.default.countArticle(keyword);
        page = page > 0 ? page : 1;
        pagesize = pagesize > 0 ? pagesize : 10;
        const articles = yield articleRepository_1.default.findArticle(userId, page, pagesize, orderBy, keyword);
        return {
            list: articles.map((article) => (Object.assign(Object.assign({}, article), { isLiked: article.ArticleLike.length > 0 ? article.ArticleLike[0].isLiked : false, ArticleLike: undefined }))),
            totalCount,
        };
    });
}
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingArticle = yield articleRepository_1.default.findById(id);
        if (!existingArticle) {
            throw new NotFoundError_1.default("NotFound");
        }
        return existingArticle;
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.update(id, data);
    });
}
function deleteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.deleteById(id);
    });
}
function saveComment(articleId, content, user) {
    return __awaiter(this, void 0, void 0, function* () {
        return commentsRepository_1.default.commentArticle(articleId, content, user);
    });
}
function findCommentsByArticle(articleId, cursor, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentsWithCursor = yield commentsRepository_1.default.findCommentsByArticle(articleId, cursor, limit + 1);
        const comments = commentsWithCursor.slice(0, limit);
        const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
        const nextCursor = cursorComment ? cursorComment.id : null;
        return {
            list: comments,
            nextCursor,
        };
    });
}
exports.default = {
    create,
    getList,
    getById,
    update,
    deleteById,
    saveComment,
    findCommentsByArticle,
};
