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
exports.articleLike = exports.getCommentList = exports.createComment = exports.deleteArticle = exports.updateArticle = exports.getArticle = exports.getArticleList = exports.createArticle = void 0;
const superstruct_1 = require("superstruct");
const articleStructs_1 = require("../structs/articleStructs");
const commonStruct_1 = require("../structs/commonStruct");
const commentsStruct_1 = require("../structs/commentsStruct");
const articleService_1 = __importDefault(require("../services/articleService"));
const likeServices_1 = __importDefault(require("../services/likeServices"));
const Unauthorized_1 = __importDefault(require("../lib/errors/Unauthorized"));
const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = (0, superstruct_1.create)(req.body, articleStructs_1.CreateArticleBodyStruct);
        console.log(data);
        if (!req.user) {
            throw new Unauthorized_1.default("Unauthorized");
        }
        const articleData = Object.assign(Object.assign({}, data), { userId: req.user.id });
        console.log(articleData);
        const article = yield articleService_1.default.create(articleData);
        void res.status(201).json(article);
        return;
    }
    catch (error) {
        const err = error;
        if (err.name === "StructError") {
            void res.status(400).json({ error: "Invalid article data" });
            return;
        }
        next(error);
    }
});
exports.createArticle = createArticle;
const getArticleList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const params = (0, superstruct_1.create)(req.query, articleStructs_1.GetArticleListParamsStruct);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new Unauthorized_1.default("Unauthorized");
        }
        const result = yield articleService_1.default.getList(userId, params);
        res.send(result);
    }
    catch (error) {
        return next(error);
    }
});
exports.getArticleList = getArticleList;
const getArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = (0, superstruct_1.create)(req.params, commonStruct_1.IdParamsStruct);
        const article = yield articleService_1.default.getById(id);
        res.send(article);
    }
    catch (error) {
        return next(error);
    }
});
exports.getArticle = getArticle;
const updateArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = (0, superstruct_1.create)(req.params, commonStruct_1.IdParamsStruct);
        const data = (0, superstruct_1.create)(req.body, articleStructs_1.UpdateArticleBodyStruct);
        const article = yield articleService_1.default.update(id, data);
        res.send(article);
    }
    catch (error) {
        return next(error);
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = (0, superstruct_1.create)(req.params, commonStruct_1.IdParamsStruct);
        yield articleService_1.default.getById(id);
        yield articleService_1.default.deleteById(id);
        res.status(204).send();
        return;
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteArticle = deleteArticle;
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: articleId } = (0, superstruct_1.create)(req.params, commonStruct_1.IdParamsStruct);
        const { content } = (0, superstruct_1.create)(req.body, commentsStruct_1.CreateCommentBodyStruct);
        console.log(content);
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user) {
            throw new Unauthorized_1.default("Unauthorized");
        }
        yield articleService_1.default.getById(articleId);
        const comment = yield articleService_1.default.saveComment(articleId, content, user);
        res.status(201).send(comment);
        return;
    }
    catch (error) {
        return next(error);
    }
});
exports.createComment = createComment;
const getCommentList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: articleId } = (0, superstruct_1.create)(req.params, commonStruct_1.IdParamsStruct);
        const { cursor, limit } = (0, superstruct_1.create)(req.query, commentsStruct_1.getCommentListParamsStruct);
        yield articleService_1.default.getById(articleId);
        const result = yield articleService_1.default.findCommentsByArticle(articleId, cursor, limit);
        res.send({ result });
        return;
    }
    catch (error) {
        return next(error);
    }
});
exports.getCommentList = getCommentList;
const articleLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new Unauthorized_1.default("Unauthorized");
        }
        const articleId = parseInt(req.params.id);
        const result = yield likeServices_1.default.likeArticleFind({ userId, articleId });
        res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
});
exports.articleLike = articleLike;
