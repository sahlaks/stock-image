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
exports.UserRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const imageModel_1 = __importDefault(require("../models/imageModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class UserRepository {
    /*..........................exist or nnot.......................*/
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ email });
            console.log(user);
            return user;
        });
    }
    /*...........................save user.............................*/
    saveUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedUser = yield userModel_1.default.create(data);
            return savedUser;
        });
    }
    /*..................................................save images..............................................*/
    saveImages(images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedImages = images.map((image) => (Object.assign(Object.assign({}, image), { userId: new mongoose_1.default.Types.ObjectId(image.userId) })));
                const saveImages = yield imageModel_1.default.insertMany(images);
                if (saveImages)
                    return true;
                return false;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*..........................................................select images............................................*/
    selectImages(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(id);
                const images = yield imageModel_1.default.find({ userId: objectId }).sort({ position: 1 });
                if (images)
                    return images;
                return null;
            }
            catch (err) {
                throw (err);
            }
        });
    }
    /*..............................................delete image.................................................*/
    deleteImage(id, uId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageId = new mongoose_1.default.Types.ObjectId(id);
                const userId = new mongoose_1.default.Types.ObjectId(uId);
                const deletedImage = yield imageModel_1.default.findOneAndDelete({ _id: imageId, userId: userId });
                if (deletedImage)
                    return true;
                return false;
            }
            catch (err) {
                throw (err);
            }
        });
    }
    /*........................................edit image...........................................*/
    findImage(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageId = new mongoose_1.default.Types.ObjectId(id);
                const uId = new mongoose_1.default.Types.ObjectId(userId);
                const existingImage = yield imageModel_1.default.findOne({ _id: imageId, userId: uId });
                return existingImage;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*........................................update................................................*/
    updateImage(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageId = new mongoose_1.default.Types.ObjectId(id);
                const updatedImage = yield imageModel_1.default.findByIdAndUpdate(imageId, { $set: updates }, { new: true });
                return updatedImage;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*...........................................rearrange position..................................................*/
    rearrangePositions(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uId = new mongoose_1.default.Types.ObjectId(id);
                const updatePromises = data.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const imageId = new mongoose_1.default.Types.ObjectId(item.id);
                    const updatedImage = yield imageModel_1.default.findOneAndUpdate({ userId: uId, _id: imageId }, { position: item === null || item === void 0 ? void 0 : item.position }, { new: true });
                    if (!updatedImage) {
                        throw new Error(`Image with id ${item.id} not found.`);
                    }
                    return updatedImage;
                }));
                const updatedImage = yield Promise.all(updatePromises);
                return updatedImage;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*........................................reset password........................................*/
    updatePassword(newpassword, uId) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = new mongoose_1.default.Types.ObjectId(uId);
            try {
                const updated = yield userModel_1.default.findByIdAndUpdate(uid, { password: newpassword }, { new: true });
                if (updated)
                    return true;
                return false;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*..........................................find user by id....................................................*/
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(id);
            const exist = yield userModel_1.default.findById(objectId);
            return exist;
        });
    }
}
exports.UserRepository = UserRepository;
