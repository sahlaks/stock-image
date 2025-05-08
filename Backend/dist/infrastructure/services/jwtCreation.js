"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtCreation = jwtCreation;
exports.refreshToken = refreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function jwtCreation(id) {
    const payload = {
        id: id
    };
    try {
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.AUTHTOKEN_KEY, { expiresIn: '1h' });
        return accessToken;
    }
    catch (error) {
        console.error('Error generating JWT token:', error);
        throw new Error('Error generating JWT token');
    }
}
function refreshToken(id) {
    const payload = {
        id: id,
    };
    try {
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESHTOKEN_KEY, { expiresIn: '7d' });
        return refreshToken;
    }
    catch (error) {
        console.error('Error generating refresh token:', error);
        throw new Error('Error generating refresh token');
    }
}
