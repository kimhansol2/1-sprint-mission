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
const productRepository_js_1 = __importDefault(require("../repository/productRepository.js"));
const NotFoundError_js_1 = __importDefault(require("../lib/errors/NotFoundError.js"));
const commentsRepository_js_1 = __importDefault(require("../repository/commentsRepository.js"));
function create(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield productRepository_js_1.default.save(data);
        if (user) {
            console.error("이미 있음");
        }
        return user;
    });
}
function list(userId_1, _a) {
    return __awaiter(this, arguments, void 0, function* (userId, { page, pagesize, orderBy, keyword }) {
        const totalCount = yield productRepository_js_1.default.count(keyword);
        page = page > 0 ? page : 1;
        pagesize = pagesize > 0 ? pagesize : 10;
        const products = yield productRepository_js_1.default.list(userId, page, pagesize, (orderBy = "recent"), keyword);
        return {
            list: products.map((product) => (Object.assign(Object.assign({}, product), { isLiked: product.ProductLike.length > 0 ? product.ProductLike[0].isLiked : false, ProductLike: undefined }))),
            totalCount,
        };
    });
}
function count(keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        return productRepository_js_1.default.count(keyword);
    });
}
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingProduct = yield productRepository_js_1.default.getById(id);
        if (!existingProduct) {
            throw new NotFoundError_js_1.default("NotFound");
        }
        return existingProduct;
    });
}
function update(id_1, _a) {
    return __awaiter(this, arguments, void 0, function* (id, { name, description, price, tags, images }) {
        return productRepository_js_1.default.update(id, {
            name,
            description,
            price,
            tags,
            images,
        });
    });
}
function deleteId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return productRepository_js_1.default.deleteId(id);
    });
}
function commentProduct(productId, content, user) {
    return __awaiter(this, void 0, void 0, function* () {
        return commentsRepository_js_1.default.commentProduct(productId, content, user);
    });
}
function findCommentsByProduct(productId, cursor, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentsWithCursor = yield commentsRepository_js_1.default.findCommentsByProduct(productId, cursor, limit + 1);
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
    list,
    count,
    getById,
    update,
    deleteId,
    commentProduct,
    findCommentsByProduct,
};
