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
exports.UserUseCase = void 0;
const messages_1 = require("../constants/messages");
const hashPassword_1 = require("../infrastructure/services/hashPassword");
const jwtCreation_1 = require("../infrastructure/services/jwtCreation");
class UserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    registrationUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let { email, mobile, password } = data;
            console.log(email, mobile, password);
            try {
                //check already existing or not
                const existingUser = yield this.userRepository.findUserByEmail(email);
                if (existingUser)
                    return { status: false, message: messages_1.REGISTRATION.USER_EXISTS };
                // const otp = generateOTP();
                // const tempUSer = new tempModel({email, mobile, password,otp})
                // await tempUSer.save();
                // const mailOptions = {
                //     email,
                //     subject: 'OTP for verification',
                //     code: otp,
                // }
                // await sendEmail(mailOptions);
                password = yield (0, hashPassword_1.generatePassword)(password);
                const userData = {
                    email,
                    mobile,
                    password,
                };
                const saved = yield this.userRepository.saveUser(userData);
                if (saved) {
                    const accesstoken = (0, jwtCreation_1.jwtCreation)(saved._id);
                    const refreshtoken = (0, jwtCreation_1.refreshToken)(saved._id);
                    return {
                        status: true,
                        message: messages_1.REGISTRATION.OTP_SENT,
                        accesstoken,
                        refreshtoken,
                    };
                }
                else {
                    return { status: false, message: messages_1.REGISTRATION.ERROR };
                }
            }
            catch (error) {
                return {
                    status: false,
                    message: messages_1.REGISTRATION.ERROR,
                };
            }
        });
    }
    /*............................................login............................................*/
    loginUserWithDat(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield this.userRepository.findUserByEmail(email);
                if (result) {
                    const isMatch = yield (0, hashPassword_1.checkPasswrdMatch)(password, result.password);
                    if (isMatch) {
                        console.log(isMatch);
                        const accesstoken = (0, jwtCreation_1.jwtCreation)(result._id);
                        const refreshtoken = (0, jwtCreation_1.refreshToken)(result._id);
                        return {
                            status: true,
                            message: messages_1.REGISTRATION.USER_VALID,
                            data: result,
                            accesstoken,
                            refreshtoken,
                        };
                    }
                    else {
                        return { status: false, message: messages_1.REGISTRATION.WRONG_PASSWORD };
                    }
                }
                else {
                    return { status: false, message: messages_1.REGISTRATION.NOT_EXIST };
                }
            }
            catch (error) {
                return { status: false, message: messages_1.REGISTRATION.ERROR };
            }
        });
    }
    /*.........................................save images.....................................*/
    saveImages(images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.userRepository.saveImages(images);
                if (res)
                    return { status: true, message: messages_1.IMAGES.UPLOADED };
                return { status: false, message: messages_1.IMAGES.NO_IMAGES };
            }
            catch (error) {
                return { status: false, message: messages_1.IMAGES.IMAGE_ERROR };
            }
        });
    }
    /*.........................................fetch images..............................................*/
    fetchImages(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.userRepository.selectImages(id);
                if (res)
                    return { status: true, message: messages_1.IMAGES.FETCH_IMAGES, images: res };
                return { status: false, message: messages_1.IMAGES.NO_IMAGES };
            }
            catch (err) {
                return { status: false, message: messages_1.IMAGES.IMAGE_ERROR };
            }
        });
    }
    /*...................................delete image.....................................*/
    deleteImageById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.userRepository.deleteImage(id, userId);
                if (res)
                    return { status: true };
                return { status: false };
            }
            catch (err) {
                return { status: false };
            }
        });
    }
    /*......................................edit image....................................*/
    updateImage(imageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, userId, imageUrl, title } = imageData;
            try {
                const existingImage = yield this.userRepository.findImage(id, userId);
                if (!existingImage) {
                    return {
                        status: false,
                        message: messages_1.IMAGES.EDIT_ERROR,
                    };
                }
                const updates = {};
                if (imageUrl)
                    updates.url = imageUrl;
                if (title)
                    updates.title = title;
                const updatedImage = yield this.userRepository.updateImage(id, updates);
                if (updatedImage)
                    return { status: true, data: updatedImage, message: messages_1.IMAGES.EDIT_IMAGE };
                return { status: false, message: messages_1.IMAGES.EDIT_ERROR };
            }
            catch (err) {
                return { status: false };
            }
        });
    }
    /*..........................................update positions............................................*/
    updatePositions(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.userRepository.rearrangePositions(userId, data);
                if (res)
                    return { status: true, images: res };
                return { status: false };
            }
            catch (err) {
                return { status: false };
            }
        });
    }
    /*..........................................reset password......................................*/
    resetPassword(data, uId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findUserById(uId);
                if (!user)
                    return { status: false, message: messages_1.REGISTRATION.NOT_EXIST };
                const isMatch = yield (0, hashPassword_1.checkPasswrdMatch)(data.currentpassword, user.password);
                if (!isMatch)
                    return { status: false, message: messages_1.PASSWORD.INCORRECT };
                data.newpassword = yield (0, hashPassword_1.generatePassword)(data.newpassword);
                const updated = yield this.userRepository.updatePassword(data.newpassword, uId);
                if (updated)
                    return { status: true, message: messages_1.PASSWORD.PASSWORD_RESET };
                return { status: false, message: messages_1.PASSWORD.PASSWORD_ERROR };
            }
            catch (err) {
                return { status: false };
            }
        });
    }
    /*...............................data by ID.......................................*/
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findUserById(id);
                if (user) {
                    return { status: true, message: "User exist", user };
                }
                else {
                    return { status: false, message: "User not exist" };
                }
            }
            catch (error) {
                return {
                    status: false,
                    message: "An error occured during fetching data",
                };
            }
        });
    }
}
exports.UserUseCase = UserUseCase;
