"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGOUT = exports.PASSWORD = exports.ERROR = exports.TOKEN = exports.IMAGES = exports.REGISTRATION = void 0;
exports.REGISTRATION = {
    USER_EXISTS: "User already exists",
    OTP_SENT: "OTP has been sent successfully",
    ERROR: "An error occurred!",
    USER_VALID: "Valid Credentials",
    WRONG_PASSWORD: "Wrong password!",
    NOT_EXIST: "User not exist!",
};
exports.IMAGES = {
    NO_IMAGES: "No files uploaded!",
    UPLOADED: "Images uploaded successfully",
    FETCH_IMAGES: "Images fetched!!",
    IMAGE_ERROR: "An error occured!",
    DELETE_IMAGE: "Image deleted successfully.",
    EDIT_IMAGE: "Image edited successfully",
    EDIT_ERROR: 'Error while editing'
};
exports.TOKEN = {
    REFRESHTOKEN_EXPIRED: "Refresh Token Expired",
    ACCESSTOKEN_EXPIRED: "Access Token Expired",
    REFRESHED: 'Token updated',
    INVALID: "Invalid Refresh Token",
};
exports.ERROR = {
    INTERNAL: "Internal Server Error"
};
exports.PASSWORD = {
    PASSWORD_RESET: 'Password changed successfully!',
    PASSWORD_ERROR: 'Error while reseting password',
    INCORRECT: 'Incorrect old password!'
};
exports.LOGOUT = {
    LOGOUT_SUCCESS: "Logout Successfully!",
    LOGOUT_ERROR: "Something happened in logout",
};
