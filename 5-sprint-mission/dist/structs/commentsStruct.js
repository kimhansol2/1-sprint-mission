"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommentBodyStruct = exports.getCommentListParamsStruct = exports.CreateCommentBodyStruct = void 0;
const superstruct_1 = require("superstruct");
const commonStruct_js_1 = require("./commonStruct.js");
exports.CreateCommentBodyStruct = (0, superstruct_1.object)({
    content: (0, superstruct_1.nonempty)((0, superstruct_1.string)()),
});
exports.getCommentListParamsStruct = commonStruct_js_1.CursorParamsStruct;
exports.UpdateCommentBodyStruct = (0, superstruct_1.partial)(exports.CreateCommentBodyStruct);
