"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHashService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class BcryptHashService {
    async hash(value) {
        return bcryptjs_1.default.hash(value, 10);
    }
    async compare(value, hash) {
        return bcryptjs_1.default.compare(value, hash);
    }
}
exports.BcryptHashService = BcryptHashService;
