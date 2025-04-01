"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultNotFoundHandler = defaultNotFoundHandler;
exports.globalErrorHandler = globalErrorHandler;
const superstruct_1 = require("superstruct");
const BadRequestError_js_1 = __importDefault(require("../lib/errors/BadRequestError.js"));
const NotFoundError_js_1 = __importDefault(require("../lib/errors/NotFoundError.js"));
const Unauthorized_js_1 = __importDefault(require("../lib/errors/Unauthorized.js"));
function defaultNotFoundHandler(req, res, next) {
    res.status(404).send({ message: "Not found" });
}
function globalErrorHandler(err, req, res, next) {
    if (err instanceof superstruct_1.StructError || err instanceof BadRequestError_js_1.default) {
        res.status(400).send({ message: err.message });
        return;
    }
    if (err instanceof SyntaxError ||
        (isBadRequestError(err) && err.status === 400)) {
        res.status(400).send({ message: "Invalid JSON" });
        return;
    }
    if (hasCode(err)) {
        console.error(err);
        res.status(500).send({ message: "Failed to process data" });
        return;
    }
    if (err instanceof NotFoundError_js_1.default) {
        res.status(404).send({ message: err.message });
        return;
    }
    if (err instanceof Unauthorized_js_1.default) {
        res.status(401).send({ message: err.message });
        return;
    }
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
    return;
}
function isBadRequestError(err) {
    return err instanceof BadRequestError_js_1.default;
}
function hasCode(err) {
    return typeof err === "object" && err !== null && "code" in err;
}
