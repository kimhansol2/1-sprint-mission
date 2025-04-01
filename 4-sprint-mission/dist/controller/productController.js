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
exports.productLike = exports.getCommentList = exports.createComment = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProductList = exports.createProduct = void 0;
const productsStruct_js_1 = require("../structs/productsStruct.js");
const commentsStruct_js_1 = require("../structs/commentsStruct.js");
const commonStruct_js_1 = require("../structs/commonStruct.js");
const superstruct_1 = require("superstruct");
const productService_js_1 = __importDefault(require("../services/productService.js"));
const likeServices_js_1 = __importDefault(require("../services/likeServices.js"));
const Unauthorized_js_1 = __importDefault(require("../lib/errors/Unauthorized.js"));
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = (0, superstruct_1.create)(req.body, productsStruct_js_1.CreateProductBodyStruct);
        const user = req.user;
        if (!user) {
            throw new Unauthorized_js_1.default("Unauthorized");
        }
        const productData = Object.assign(Object.assign({}, data), { userId: user.id });
        console.log("Creating product with data:", productData);
        const product = yield productService_js_1.default.create(productData);
        res.status(201).json({ message: product });
    }
    catch (error) {
        return next(error);
    }
});
exports.createProduct = createProduct;
const getProductList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, pagesize, orderBy, keyword } = (0, superstruct_1.create)(req.query, productsStruct_js_1.GetProductListParamsStruct);
        const user = req.user;
        if (!user) {
            throw new Unauthorized_js_1.default("Unauthorized");
        }
        const finalKeyword = keyword || "";
        const totalCount = yield productService_js_1.default.count(finalKeyword);
        const products = yield productService_js_1.default.list(user.id, {
            page,
            pagesize,
            orderBy,
            keyword,
        });
        res.send({ list: products, totalCount });
        return;
    }
    catch (error) {
        return next(error);
    }
});
exports.getProductList = getProductList;
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = (0, superstruct_1.create)(req.params, commonStruct_js_1.IdParamsStruct);
        const product = yield productService_js_1.default.getById(id);
        res.send(product);
        return;
    }
    catch (error) {
        return next(error);
    }
});
exports.getProduct = getProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = (0, superstruct_1.create)(req.params, commonStruct_js_1.IdParamsStruct);
        const { name, description, price, tags, images } = (0, superstruct_1.create)(req.body, productsStruct_js_1.UpdateProductBodyStruct);
        yield productService_js_1.default.getById(id);
        const product = yield productService_js_1.default.update(id, {
            name,
            description,
            price,
            tags,
            images,
        });
        res.send(product);
        return;
    }
    catch (error) {
        return next(error);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = (0, superstruct_1.create)(req.params, commonStruct_js_1.IdParamsStruct);
        yield productService_js_1.default.getById(id);
        yield productService_js_1.default.deleteId(id);
        res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteProduct = deleteProduct;
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStruct_js_1.IdParamsStruct);
        const { content } = (0, superstruct_1.create)(req.body, commentsStruct_js_1.CreateCommentBodyStruct);
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user) {
            throw new Unauthorized_js_1.default("Unauthorized");
        }
        yield productService_js_1.default.getById(productId);
        const comment = yield productService_js_1.default.commentProduct(productId, content, user);
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
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStruct_js_1.IdParamsStruct);
        const { cursor, limit } = (0, superstruct_1.create)(req.query, commentsStruct_js_1.getCommentListParamsStruct);
        yield productService_js_1.default.getById(productId);
        const result = yield productService_js_1.default.findCommentsByProduct(productId, cursor, limit);
        res.send({ result });
        return;
    }
    catch (error) {
        return next(error);
    }
});
exports.getCommentList = getCommentList;
const productLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productId = parseInt(req.params.id);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new Unauthorized_js_1.default("Unauthorized");
        }
        const result = yield likeServices_js_1.default.likeProductFind({ userId, productId });
        res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
});
exports.productLike = productLike;
