import { NextFunction, Request, Response } from "express";
import { UserUseCase } from "../../usecases/userUsecases";
import { IMAGES, LOGOUT, PASSWORD, REGISTRATION, TOKEN } from "../../constants/messages";
import { ENUM } from "../../constants/statusCode";
import { uploadImage } from "../../infrastructure/services/cloudinaryService";
import { AuthRequest } from "../../domain/interface/auth";
import { NestedPaths } from "mongoose";
import { verifyRefreshToken } from "../../infrastructure/services/tokenVerification";
import { jwtCreation } from "../../infrastructure/services/jwtCreation";

export class UserController {
  constructor(private UserUseCase: UserUseCase) {}

  /*...............................signup...............................*/
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      console.log('inside controller');
      
      console.log(req.body);
      
      const result = await this.UserUseCase.registrationUser(req.body);
      if (result.status) {
        res.cookie("access_token", result.accesstoken, {
            maxAge:  48*60*60*1000,
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.cookie("refresh_token", result.refreshtoken, {
            maxAge: 5*60*1000,
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        return res
          .status(ENUM.OK)
          .json({ success: true, message: REGISTRATION.OTP_SENT });
      } else return res.json({ success: false, message: result.message });
    } catch (err) {
      next(err);
    }
  }

  /*....................................login..................................*/
  async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
        console.log(req);

        
      const result = await this.UserUseCase.loginUserWithDat(req);
      if (result.status) {
        res.cookie("access_token", result.accesstoken, {
            maxAge: 48*60*60*1000,
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.cookie("refresh_token", result.refreshtoken, {
            maxAge: 5*60*1000,
          httpOnly: true,
          secure: true,
          sameSite: "none",

        });
        return res.status(ENUM.OK).json({ success: true, data: result.data });
      } else {
        return res
          .status(ENUM.BAD_REQUEST)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      next(error);
    }
  }

  /*..........................................images uploading............................................*/
  async imageUpload(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const bodyTitles = req.body;
      const userId = req.user?.id;

      if (!imageFiles || imageFiles.length === 0)
        return res.status(400).json({ message: IMAGES.NO_IMAGES });
      const uploadedImageData: { url: string; title: string }[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const imageBuffer = imageFiles[i].buffer;
        const imageUrl = await uploadImage(imageBuffer, "picCloud");
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
      const savedImages = await this.UserUseCase.saveImages(imagesToSave);
      if (savedImages.status)
        return res
          .status(ENUM.OK)
          .json({ success: true, message: savedImages?.message });
        return res
            .status(ENUM.BAD_REQUEST)
            .json({ success: false, message: savedImages?.message});   
    } catch (error) {
      next(error);
    }
  }

  /*........................................fetch images..........................................*/
  async fetchImages(req: AuthRequest, res: Response, next: NextFunction): Promise<Response|void>{
    try{
        const user = req.user?.id as string;
        const result = await this.UserUseCase.fetchImages(user)
        if(result.status) return res.status(ENUM.OK).json({success: true, message: result.message, images: result.images})
        return res.status(ENUM.BAD_REQUEST).json({success: false, message: result.message})
    }catch(err){
        next(err)
    }
}

/*...............................................delete image........................................*/
async deleteImage(req: AuthRequest, res: Response, next: NextFunction): Promise<Response|void>{
    const {id} = req.params;
    const userId = req.user?.id as string
    try{
        const result = await this.UserUseCase.deleteImageById(id,userId)
        if(result.status) return res.status(ENUM.OK).json({success: true, message: IMAGES.DELETE_IMAGE})
        return res.status(ENUM.BAD_REQUEST).json({success: false, message: IMAGES.IMAGE_ERROR})
    }catch(err){
        next(err)
    } 
}

    /*....................................edit image......................................*/
    async editImage(req: AuthRequest, res: Response, next: NextFunction): Promise<Response|void>{
        try{
            const userId = req.user?.id as string
            const {id, title} = req.body;
            const imageFiles = req.files as Express.Multer.File[];
            let imageUrl;
            if (imageFiles && imageFiles.length > 0) {
                const imageBuffer = imageFiles[0].buffer
                imageUrl = await uploadImage(imageBuffer, "picCloud");
            }
            let imageToUpdate;

            if(imageUrl){
           imageToUpdate = {
            id,
            userId,
            imageUrl,
            title 
           }
            }   else{
                imageToUpdate = {
                    id,
                    userId,
                    title 
                   }
            }
            const result = await this.UserUseCase.updateImage(imageToUpdate)
            if(result.status) return res.status(ENUM.OK).json({success: true, image: result.data, message: result.message})
            return res.status(ENUM.BAD_REQUEST).json({success: false, message: result.message})
        }catch(err){
            next(err)
        }
    }

    /*....................................save new positions.............................................*/
    async updatePositions(req: AuthRequest, res: Response, next: NextFunction): Promise<Response|void>{
        const userId = req.user?.id as string;
        try{
            const result = await this.UserUseCase.updatePositions(req.body,userId)
            if(result.status) return res.status(ENUM.OK).json({success: true, images: result.images})
            return res.status(ENUM.BAD_REQUEST).json({success: false})
        }catch(err){
            next(err)
        }
    }

    /*............................................reset password..............................................*/
    async resetPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<Response|void>{
        try{
            const uId = req.user?.id as string
            const result = await this.UserUseCase.resetPassword(req.body,uId)
            if(result.status) return res.status(ENUM.OK).json({success: true, message: PASSWORD.PASSWORD_RESET})
            return res.status(ENUM.BAD_REQUEST).json({success: false, message: result.message})
        }catch(err){
            next(err)
        }
    }

    /*..................................................refreshtoken...............................................*/
    async refreshToken(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<Response | void> {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken)
          res
            .status(401)
            .json({ success: false, message: "Refresh Token Expired" });
    
        try {
          const decoded = verifyRefreshToken(refreshToken);
    
          if (!decoded || !decoded.id) {
            res
              .status(ENUM.UNAUTHORIZED)
              .json({ success: false, message: TOKEN.REFRESHTOKEN_EXPIRED });
          }
    
          const result = await this.UserUseCase.findUserById(decoded.id);
    
          if (!result || !result.user) {
            return res
              .status(ENUM.UNAUTHORIZED)
              .json({ success: false, message: TOKEN.INVALID });
          }
          const user = result.user;
          if (!user._id) {
            return res.status(ENUM.BAD_REQUEST).json({
              success: false,
              message: TOKEN.INVALID,
            });
          }
    
          const newAccessToken = jwtCreation(user._id);
          res.cookie("access_token", newAccessToken,  { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
          res.status(ENUM.OK).json({ success: true, message: TOKEN.REFRESHED});
        } catch (error) {
          next(error);
        }
      }
    
  /*..........................................logout user........................................*/
  async logoutUser(req: Request, res: Response, next: NextFunction): Promise<Response>{
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
            return reject(
              res
                .status(ENUM.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: LOGOUT.LOGOUT_ERROR })
            );
          }
          res.clearCookie("access_token");
          res.clearCookie("refresh_token");
          return resolve(
            res
              .status(ENUM.OK)
              .json({ success: true, message: LOGOUT.LOGOUT_SUCCESS })
          );
        });
      });
    }



  }


