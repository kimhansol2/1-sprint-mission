"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateArticleBodyStruct = exports.CreateArticleBodyStruct = exports.GetArticleListParamsStruct = void 0;
const superstruct_1 = require("superstruct");
const commonStruct_js_1 = require("./commonStruct.js");
exports.GetArticleListParamsStruct = commonStruct_js_1.PageParamsStruct;
exports.CreateArticleBodyStruct = (0, superstruct_1.object)({
    title: (0, superstruct_1.nonempty)((0, superstruct_1.string)()),
    content: (0, superstruct_1.nonempty)((0, superstruct_1.string)()),
    image: (0, superstruct_1.nullable)((0, superstruct_1.string)()),
});
exports.UpdateArticleBodyStruct = (0, superstruct_1.partial)(exports.CreateArticleBodyStruct);
