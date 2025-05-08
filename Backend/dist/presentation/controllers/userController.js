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
exports.UserController = void 0;
const messages_1 = require("../../constants/messages");
const statusCode_1 = require("../../constants/statusCode");
const cloudinaryService_1 = require("../../infrastructure/services/cloudinaryService");
const tokenVerification_1 = require("../../infrastructure/services/tokenVerification");
const jwtCreation_1 = require("../../infrastructure/services/jwtCreation");
class UserController {
    constructor(UserUseCase) {
        this.UserUseCase = UserUseCase;
    }
    /*...............................signup...............................*/
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside controller');
                console.log(req.body);
                const result = yield this.UserUseCase.registrationUser(req.body);
                if (result.status) {
                    res.cookie("access_token", result.accesstoken, {
<<<<<<< HEAD
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        path: "/",
                    });
                    res.cookie("refresh_token", result.refreshtoken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        path: "/",
=======
                        maxAge: 48 * 60 * 60 * 1000,
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                    });
                    res.cookie("refresh_token", result.refreshtoken, {
                        maxAge: 5 * 60 * 1000,
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
>>>>>>> 661e1b656fd0f1864ef756ee9ab589d7bf47cc43
                    });
                    return res
                        .status(statusCode_1.ENUM.OK)
                        .json({ success: true, message: messages_1.REGISTRATION.OTP_SENT });
                }
                else
                    return res.json({ success: false, message: result.message });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*....................................login..................................*/
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req);
                const result = yield this.UserUseCase.loginUserWithDat(req);
<<<<<<< HEAD
                console.log(result);
                if (result.status) {
                    res.cookie("access_token", result.accesstoken, {
=======
                if (result.status) {
                    res.cookie("access_token", result.accesstoken, {
                        maxAge: 48 * 60 * 60 * 1000,
>>>>>>> 661e1b656fd0f1864ef756ee9ab589d7bf47cc43
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                    });
                    res.cookie("refresh_token", result.refreshtoken, {
<<<<<<< HEAD
=======
                        maxAge: 5 * 60 * 1000,
>>>>>>> 661e1b656fd0f1864ef756ee9ab589d7bf47cc43
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                    });
                    return res.status(statusCode_1.ENUM.OK).json({ success: true, data: result.data });
                }
                else {
                    return res
                        .status(statusCode_1.ENUM.BAD_REQUEST)
                        .json({ success: false, message: result.message });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*..........................................images uploading............................................*/
    imageUpload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const imageFiles = req.files;
                const bodyTitles = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!imageFiles || imageFiles.length === 0)
                    return res.status(400).json({ message: messages_1.IMAGES.NO_IMAGES });
                const uploadedImageData = [];
                for (let i = 0; i < imageFiles.length; i++) {
                    const imageBuffer = imageFiles[i].buffer;
                    const imageUrl = yield (0, cloudinaryService_1.uploadImage)(imageBuffer, "picCloud");
                    const titleKey = `title_${i}`;
                    const title = bodyTitles[titleKey] || "Untitled";
                    uploadedImageData.push({
                        url: imageUrl,
                        title,
                    });
                }
                const imagesToSave = uploadedImageData.map((data) => ({
                    userId,
                    url: data.url,
                    title: data.title,
                }));
                const savedImages = yield this.UserUseCase.saveImages(imagesToSave);
                if (savedImages.status)
                    return res
                        .status(statusCode_1.ENUM.OK)
                        .json({ success: true, message: savedImages === null || savedImages === void 0 ? void 0 : savedImages.message });
                return res
                    .status(statusCode_1.ENUM.BAD_REQUEST)
                    .json({ success: false, message: savedImages === null || savedImages === void 0 ? void 0 : savedImages.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*........................................fetch images..........................................*/
    fetchImages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const result = yield this.UserUseCase.fetchImages(user);
                if (result.status)
                    return res.status(statusCode_1.ENUM.OK).json({ success: true, message: result.message, images: result.images });
                return res.status(statusCode_1.ENUM.BAD_REQUEST).json({ success: false, message: result.message });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*...............................................delete image........................................*/
    deleteImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const result = yield this.UserUseCase.deleteImageById(id, userId);
                if (result.status)
                    return res.status(statusCode_1.ENUM.OK).json({ success: true, message: messages_1.IMAGES.DELETE_IMAGE });
                return res.status(statusCode_1.ENUM.BAD_REQUEST).json({ success: false, message: messages_1.IMAGES.IMAGE_ERROR });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*....................................edit image......................................*/
    editImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { id, title } = req.body;
                const imageFiles = req.files;
                let imageUrl;
<<<<<<< HEAD
                if (imageFiles) {
                    const imageBuffer = imageFiles[0].buffer;
                    imageUrl = yield (0, cloudinaryService_1.uploadImage)(imageBuffer, "picCloud");
                }
                const imageToUpdate = {
                    id,
                    userId,
                    imageUrl,
                    title
                };
=======
                if (imageFiles && imageFiles.length > 0) {
                    const imageBuffer = imageFiles[0].buffer;
                    imageUrl = yield (0, cloudinaryService_1.uploadImage)(imageBuffer, "picCloud");
                }
                let imageToUpdate;
                if (imageUrl) {
                    imageToUpdate = {
                        id,
                        userId,
                        imageUrl,
                        title
                    };
                }
                else {
                    imageToUpdate = {
                        id,
                        userId,
                        title
                    };
                }
>>>>>>> 661e1b656fd0f1864ef756ee9ab589d7bf47cc43
                const result = yield this.UserUseCase.updateImage(imageToUpdate);
                if (result.status)
                    return res.status(statusCode_1.ENUM.OK).json({ success: true, image: result.data, message: result.message });
                return res.status(statusCode_1.ENUM.BAD_REQUEST).json({ success: false, message: result.message });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*....................................save new positions.............................................*/
    updatePositions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const result = yield this.UserUseCase.updatePositions(req.body, userId);
                if (result.status)
                    return res.status(statusCode_1.ENUM.OK).json({ success: true, images: result.images });
                return res.status(statusCode_1.ENUM.BAD_REQUEST).json({ success: false });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*............................................reset password..............................................*/
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const uId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const result = yield this.UserUseCase.resetPassword(req.body, uId);
                if (result.status)
                    return res.status(statusCode_1.ENUM.OK).json({ success: true, message: messages_1.PASSWORD.PASSWORD_RESET });
                return res.status(statusCode_1.ENUM.BAD_REQUEST).json({ success: false, message: result.message });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*..................................................refreshtoken...............................................*/
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refresh_token;
            if (!refreshToken)
                res
                    .status(401)
                    .json({ success: false, message: "Refresh Token Expired" });
            try {
                const decoded = (0, tokenVerification_1.verifyRefreshToken)(refreshToken);
                if (!decoded || !decoded.id) {
                    res
                        .status(statusCode_1.ENUM.UNAUTHORIZED)
                        .json({ success: false, message: messages_1.TOKEN.REFRESHTOKEN_EXPIRED });
                }
                const result = yield this.UserUseCase.findUserById(decoded.id);
                if (!result || !result.user) {
                    return res
                        .status(statusCode_1.ENUM.UNAUTHORIZED)
                        .json({ success: false, message: messages_1.TOKEN.INVALID });
                }
                const user = result.user;
                if (!user._id) {
                    return res.status(statusCode_1.ENUM.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.TOKEN.INVALID,
                    });
                }
                const newAccessToken = (0, jwtCreation_1.jwtCreation)(user._id);
                res.cookie("access_token", newAccessToken, { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
                res.status(statusCode_1.ENUM.OK).json({ success: true, message: messages_1.TOKEN.REFRESHED });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*..........................................logout user........................................*/
    logoutUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) {
                        console.error("Error destroying session:", err);
                        return reject(res
                            .status(statusCode_1.ENUM.INTERNAL_SERVER_ERROR)
                            .json({ success: false, message: messages_1.LOGOUT.LOGOUT_ERROR }));
                    }
                    res.clearCookie("access_token");
                    res.clearCookie("refresh_token");
                    return resolve(res
                        .status(statusCode_1.ENUM.OK)
                        .json({ success: true, message: messages_1.LOGOUT.LOGOUT_SUCCESS }));
                });
            });
        });
    }
}
exports.UserController = UserController;
