"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tempSchema = new mongoose_1.default.Schema({
    email: { type: String },
    mobile: { type: String },
    password: { type: String },
    otp: { type: String },
    createdAt: { type: Date, default: Date.now, expires: '1h' }
});
const tempModel = mongoose_1.default.model('Temp', tempSchema);
exports.default = tempModel;
