import { Request } from "express";
import { IMAGES, PASSWORD, REGISTRATION } from "../constants/messages";
import { IUserRepository } from "../domain/interface/IUserRepository";
import tempModel from "../infrastructure/models/temporaryModel";
import {
  checkPasswrdMatch,
  generatePassword,
} from "../infrastructure/services/hashPassword";
import { sendEmail } from "../infrastructure/services/mailService";
import { generateOTP } from "../infrastructure/services/otpGenerator";
import {
  jwtCreation,
  refreshToken,
} from "../infrastructure/services/jwtCreation";
import IUser from "../domain/entities/User";
import IImages from "../domain/entities/images";

export class UserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async registrationUser(data: any): Promise<{
    status: boolean;
    message?: string;
    accesstoken?: string;
    refreshtoken?: string;
  }> {
    let { email, mobile, password } = data;
    console.log(email, mobile, password);

    try {
      //check already existing or not
      const existingUser = await this.userRepository.findUserByEmail(email);
      if (existingUser)
        return { status: false, message: REGISTRATION.USER_EXISTS };
      // const otp = generateOTP();

      // const tempUSer = new tempModel({email, mobile, password,otp})
      // await tempUSer.save();

      // const mailOptions = {
      //     email,
      //     subject: 'OTP for verification',
      //     code: otp,
      // }
      // await sendEmail(mailOptions);
      password = await generatePassword(password);
      const userData = {
        email,
        mobile,
        password,
      };
      const saved = await this.userRepository.saveUser(userData);
      if (saved) {
        const accesstoken = jwtCreation(saved._id);
        const refreshtoken = refreshToken(saved._id);
        return {
          status: true,
          message: REGISTRATION.OTP_SENT,
          accesstoken,
          refreshtoken,
        };
      } else {
        return { status: false, message: REGISTRATION.ERROR };
      }
    } catch (error) {
      return {
        status: false,
        message: REGISTRATION.ERROR,
      };
    }
  }

  /*............................................login............................................*/
  async loginUserWithDat(
    req: Request
  ): Promise<{
    status: boolean;
    message?: string;
    data?: IUser;
    accesstoken?: string;
    refreshtoken?: string;
  }> {
    const { email, password } = req.body;
    try {
      const result = await this.userRepository.findUserByEmail(email);
      if (result) {
        const isMatch = await checkPasswrdMatch(password, result.password);
        if (isMatch) {
            console.log(isMatch);
            
          const accesstoken = jwtCreation(result._id);
          const refreshtoken = refreshToken(result._id);
          return {
            status: true,
            message: REGISTRATION.USER_VALID,
            data: result,
            accesstoken,
            refreshtoken,
          };
        } else {
          return { status: false, message: REGISTRATION.WRONG_PASSWORD };
        }
      } else {
        return { status: false, message: REGISTRATION.NOT_EXIST };
      }
    } catch (error) {
      return { status: false, message: REGISTRATION.ERROR };
    }
  }

  /*.........................................save images.....................................*/
  async saveImages(
    images: { userId: string | undefined; url: string; title: string }[]
  ): Promise<{ status: boolean; message?: string }> {
    try {
      const res = await this.userRepository.saveImages(images);
      if (res) return { status: true, message: IMAGES.UPLOADED };
      return { status: false, message: IMAGES.NO_IMAGES };
    } catch (error) {
      return { status: false, message: IMAGES.IMAGE_ERROR };
    }
  }

  /*.........................................fetch images..............................................*/
  async fetchImages(
    id: string
  ): Promise<{ status: boolean; message?: string; images?: IImages[] }> {
    try {
      const res = await this.userRepository.selectImages(id);
      if (res)
        return { status: true, message: IMAGES.FETCH_IMAGES, images: res };
      return { status: false, message: IMAGES.NO_IMAGES };
    } catch (err) {
      return { status: false, message: IMAGES.IMAGE_ERROR };
    }
  }

  /*...................................delete image.....................................*/
  async deleteImageById(
    id: string,
    userId: string
  ): Promise<{ status: boolean }> {
    try {
      const res = await this.userRepository.deleteImage(id, userId);
      if (res) return { status: true };
      return { status: false };
    } catch (err) {
      return { status: false };
    }
  }

  /*......................................edit image....................................*/
  async updateImage(imageData: {
    id: string;
    userId: string;
    imageUrl?: string;
    title?: string;
  }): Promise<{ status: boolean; data?: IImages; message?: string }> {
    const { id, userId, imageUrl, title } = imageData;
    try {
      const existingImage = await this.userRepository.findImage(id, userId);
      if (!existingImage) {
        return {
          status: false,
          message: IMAGES.EDIT_ERROR,
        };
      }
      const updates: Record<string, any> = {};
      if (imageUrl) updates.url = imageUrl;
      if (title) updates.title = title;
      const updatedImage = await this.userRepository.updateImage(id, updates);
      if (updatedImage)
        return { status: true, data: updatedImage, message: IMAGES.EDIT_IMAGE };
      return { status: false, message: IMAGES.EDIT_ERROR };
    } catch (err) {
      return { status: false };
    }
  }

  /*..........................................update positions............................................*/
  async updatePositions(
    data: {id: string, position: number}[], userId: string
  ): Promise<{ status: boolean; images?: IImages[] }> {
    try{
        const res = await this.userRepository.rearrangePositions(userId,data)
        if(res) return {status: true, images: res} 
        return {status: false}
    }catch(err){
        return {status: false}
    }
  }

  /*..........................................reset password......................................*/
  async resetPassword(data: {currentpassword: string, newpassword: string}, uId: string): Promise<{status: boolean; message?: string}>{
    try{
        const user = await this.userRepository.findUserById(uId);
        if (!user) return { status: false, message: REGISTRATION.NOT_EXIST };

        const isMatch = await checkPasswrdMatch(data.currentpassword, user.password);
        if(!isMatch) return {status: false, message: PASSWORD.INCORRECT}

        data.newpassword = await generatePassword(data.newpassword)
        const updated = await this.userRepository.updatePassword(data.newpassword, uId)
        if(updated) return {status: true, message: PASSWORD.PASSWORD_RESET}
        return {status: false, message: PASSWORD.PASSWORD_ERROR}
    }catch(err){
        return {status: false}
    }
  }

  /*...............................data by ID.......................................*/
  async findUserById(
    id: string
  ): Promise<{ status: boolean; message?: string; user?: IUser }> {
    try {
      const user = await this.userRepository.findUserById(id);
      if (user) {
        return { status: true, message: "User exist", user };
      } else {
        return { status: false, message: "User not exist" };
      }
    } catch (error) {
      return {
        status: false,
        message: "An error occured during fetching data",
      };
    }
  }

}
