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
exports.deleteComment = exports.updateComment = void 0;
const superstruct_1 = require("superstruct");
const commentsStruct_js_1 = require("../structs/commentsStruct.js");
const commonStruct_js_1 = require("../structs/commonStruct.js");
const commentsService_js_1 = __importDefault(require("../services/commentsService.js"));
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = (0, superstruct_1.create)(req.params, commonStruct_js_1.IdParamsStruct);
        const { content = "" } = (0, superstruct_1.create)(req.body, commentsStruct_js_1.UpdateCommentBodyStruct);
        yield commentsService_js_1.default.findById(id);
        const comment = yield commentsService_js_1.default.update(id, content);
        res.send(comment);
    }
    catch (error) {
        return next(error);
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = (0, superstruct_1.create)(req.params, commonStruct_js_1.IdParamsStruct);
        yield commentsService_js_1.default.findById(id);
        yield commentsService_js_1.default.deleteId(id);
        res.status(204).send();
        return; // 요청이 성공적으로 처리되면 no content를 보냄
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteComment = deleteComment;
