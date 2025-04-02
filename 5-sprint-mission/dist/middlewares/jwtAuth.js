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
exports.verifyproductAuth = verifyproductAuth;
exports.verifyarticleAuth = verifyarticleAuth;
exports.verifycommentAuth = verifycommentAuth;
exports.verifyuserAuth = verifyuserAuth;
const Unauthorized_1 = __importDefault(require("../lib/errors/Unauthorized"));
const productRepository_1 = __importDefault(require("../repository/productRepository"));
const articleRepository_1 = __importDefault(require("../repository/articleRepository"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const commentsRepository_1 = __importDefault(require("../repository/commentsRepository"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
function verifyproductAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id, 10);
        try {
            if (!req.user) {
                return next(new Unauthorized_1.default("Unauthorized"));
            }
            const product = yield productRepository_1.default.getById(id);
            if (!product) {
                throw new NotFoundError_1.default("NotFound");
            }
            if (product.userId !== req.user.id) {
                throw new Unauthorized_1.default("Unauthorized");
            }
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
}
function verifyarticleAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id, 10);
        try {
            if (!req.user) {
                return next(new Unauthorized_1.default("Unauthorized"));
            }
            const article = yield articleRepository_1.default.findById(id);
            if (!article) {
                throw new NotFoundError_1.default("NotFound");
            }
            if (article.userId !== req.user.id) {
                throw new Unauthorized_1.default("Unauthorized");
            }
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
}
function verifycommentAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return next(new Unauthorized_1.default("Unauthorized"));
        }
        const id = parseInt(req.params.id, 10);
        try {
            const comment = yield commentsRepository_1.default.findById(id);
            if (!comment) {
                throw new NotFoundError_1.default("NotFound");
            }
            if (comment.userId !== req.user.id) {
                throw new Unauthorized_1.default("Unauthorized");
            }
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
}
function verifyuserAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const id = parseInt(req.params.id, 10);
        try {
            if (!req.user) {
                return next(new Unauthorized_1.default("Unauthorized"));
            }
            const user = yield userRepository_1.default.findId(id);
            if (!user) {
                throw new NotFoundError_1.default("NotFound");
            }
            if (user.id !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                throw new Unauthorized_1.default("Unauthorized");
            }
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
}
