import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create the transporter
const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSKEY,
  },
});

// Function to send an email
export async function sendEmail(mailOptions: {
  email: string;
  subject: string;
  code: string;
}): Promise<boolean> {
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
    const info = await transporter.sendMail({
      from: `"PicCloud" <${process.env.EMAIL}>`, 
      to: mailOptions.email,
      subject: mailOptions.subject,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);
    return true; 
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
