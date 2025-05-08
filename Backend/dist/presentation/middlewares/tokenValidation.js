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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTokens = void 0;
const tokenVerification_1 = require("../../infrastructure/services/tokenVerification");
const statusCode_1 = require("../../constants/statusCode");
const messages_1 = require("../../constants/messages");
const validateTokens = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies.access_token;
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            res.status(statusCode_1.ENUM.UNAUTHORIZED).json({ message: messages_1.TOKEN.REFRESHTOKEN_EXPIRED });
            return;
        }
        const refreshTokenValid = (0, tokenVerification_1.verifyRefreshToken)(refreshToken);
        if (!refreshTokenValid || !refreshTokenValid.id) {
            res
                .status(statusCode_1.ENUM.UNAUTHORIZED)
                .json({ success: false, message: messages_1.TOKEN.REFRESHTOKEN_EXPIRED });
            return;
        }
        if (!accessToken) {
            res
                .status(statusCode_1.ENUM.UNAUTHORIZED)
                .json({ success: false, message: messages_1.TOKEN.ACCESSTOKEN_EXPIRED });
            return;
        }
        const decoded = (0, tokenVerification_1.verifyAccessToken)(accessToken);
        if (!decoded.id || !decoded) {
            res
                .status(statusCode_1.ENUM.UNAUTHORIZED)
                .json({ success: false, message: messages_1.TOKEN.ACCESSTOKEN_EXPIRED });
            return;
        }
        req.user = {
            id: decoded.id,
        };
        next();
    }
    catch (err) {
        res.status(statusCode_1.ENUM.INTERNAL_SERVER_ERROR).json({ success: false, message: messages_1.ERROR.INTERNAL });
    }
});
exports.validateTokens = validateTokens;
