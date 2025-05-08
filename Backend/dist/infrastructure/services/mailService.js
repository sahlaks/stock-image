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
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create the transporter
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSKEY,
    },
});
// Function to send an email
function sendEmail(mailOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center;">
            <h2>Welcome to PicCloud!</h2>
            <p>Thank you for registering with us. Please enter the OTP below to verify your email:</p>
            <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f0f0f0; border-radius: 5px;">
                ${mailOptions.code}
            </div>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best Regards,</p>
            <p><strong>The PicCloud Team</strong></p>
        </div>
    `;
        try {
            const info = yield transporter.sendMail({
                from: `"PicCloud" <${process.env.EMAIL}>`,
                to: mailOptions.email,
                subject: mailOptions.subject,
                html: htmlContent,
            });
            console.log("Message sent: %s", info.messageId);
            return true;
        }
        catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    });
}
