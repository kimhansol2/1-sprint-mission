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
function save(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Saving product with data:", data);
        return prisma_js_1.default.product.create({ data });
    });
}
function list(userId, page, pagesize, orderBy, keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.product.findMany({
            skip: (page - 1) * pagesize,
            take: pagesize,
            orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
            where: keyword
                ? {
                    OR: [
                        { name: { contains: keyword } },
                        { description: { contains: keyword } },
                    ],
                }
                : undefined,
            include: {
                ProductLike: {
                    where: { userId: userId },
                    select: { isLiked: true },
                },
            },
        });
    });
}
function count(keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.product.count({
            where: keyword ? { name: { contains: keyword } } : undefined,
        });
    });
}
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.product.findUnique({
            where: { id },
        });
    });
}
function update(id_1, _a) {
    return __awaiter(this, arguments, void 0, function* (id, { name, description, price, tags, images }) {
        return prisma_js_1.default.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                tags: tags ? { set: tags } : undefined,
                images: images ? { set: images } : undefined,
            },
        });
    });
}
function deleteId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.product.delete({
            where: { id },
        });
    });
}
function userProduct(id_1, _a) {
    return __awaiter(this, arguments, void 0, function* (id, { page, pagesize, orderBy, }) {
        return prisma_js_1.default.product.findMany({
            where: { userId: id },
            skip: (page - 1) * pagesize,
            take: pagesize,
            orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
        });
    });
}
exports.default = {
    save,
    list,
    count,
    getById,
    update,
    deleteId,
    userProduct,
};
