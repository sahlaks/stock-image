import mongoose from "mongoose";
import IImages from "../../domain/entities/images";
import IUser from "../../domain/entities/User";
import { IUserRepository } from "../../domain/interface/IUserRepository";
import imageModel from "../models/imageModel";
import userModel from "../models/userModel";

export class UserRepository implements IUserRepository {
  /*..........................exist or nnot.......................*/
  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await userModel.findOne({ email });
    console.log(user);
    
    return user;
  }

  /*...........................save user.............................*/
  async saveUser(data: {
    email: string;
    mobile: string;
    password: string;
  }): Promise<IUser | null> {
    const savedUser = await userModel.create(data);
    return savedUser;
  }

  /*..................................................save images..............................................*/
  async saveImages(
    images: { userId: string | undefined; url: string; title: string }[]
  ): Promise<boolean> {
    try {
      const updatedImages = images.map((image) => ({
        ...image,
        userId: new mongoose.Types.ObjectId(image.userId),
      }));

      const saveImages = await imageModel.insertMany(images);
      if(saveImages) return true
      return false
    } catch (error) {
      throw error;
    }
  }

  /*..........................................................select images............................................*/
  async selectImages(id: string): Promise<IImages[]|null> {
      try{
        const objectId = new mongoose.Types.ObjectId(id)
        const images = await imageModel.find({userId: objectId}).sort({position:1})
        if(images) return images
        return null;
      }catch(err){
        throw(err)
      }
  }

  /*..............................................delete image.................................................*/
  async deleteImage(id: string, uId: string): Promise<boolean> {
      try{
        const imageId = new mongoose.Types.ObjectId(id)
        const userId = new mongoose.Types.ObjectId(uId)
        const deletedImage = await imageModel.findOneAndDelete({_id: imageId, userId: userId})
        if(deletedImage) return true
        return false
      }catch(err){
        throw(err)
      }
  }

  /*........................................edit image...........................................*/
  async findImage(id: string, userId: string): Promise<IImages | null> {
    try {
      const imageId = new mongoose.Types.ObjectId(id);
      const uId = new mongoose.Types.ObjectId(userId);
  
      const existingImage = await imageModel.findOne({ _id: imageId, userId: uId });
      return existingImage as IImages | null;
    } catch (err) {
      throw err;
    }
  }

  /*........................................update................................................*/
  async updateImage(
    id: string,
    updates: { url?: string; title?: string }
  ): Promise<IImages | null> {
    try {
      const imageId = new mongoose.Types.ObjectId(id);
  
      const updatedImage = await imageModel.findByIdAndUpdate(
        imageId,
        { $set: updates },
        { new: true } 
      );
      return updatedImage as IImages | null;
    } catch (err) {
      throw err;
    }
  }
  
  /*...........................................rearrange position..................................................*/
  async rearrangePositions(id: string, data: {id: string, position: number}[]): Promise<IImages[]> {
      try{
        const uId = new mongoose.Types.ObjectId(id);
        const updatePromises = data.map(async (item) => {
            const imageId = new mongoose.Types.ObjectId(item.id);
      
            const updatedImage = await imageModel.findOneAndUpdate(
              { userId: uId, _id: imageId },
              { position: item?.position },
              { new: true }
            );
      
            if (!updatedImage) {
              throw new Error(`Image with id ${item.id} not found.`);
            }
            return updatedImage;
          });
      
          const updatedImage = await Promise.all(updatePromises);
        return updatedImage
        
      }catch(err){
        throw err;
      }
  }

  /*........................................reset password........................................*/
  async updatePassword(newpassword: string, uId: string): Promise<boolean> {
      const uid = new mongoose.Types.ObjectId(uId)
      try{
        const updated = await userModel.findByIdAndUpdate(uid, {password: newpassword}, { new: true })
        if(updated) return true;
        return false;
      }catch(err){
        throw err;
      }
  }

  /*..........................................find user by id....................................................*/
  async findUserById(id: string): Promise<IUser> {
    const objectId = new mongoose.Types.ObjectId(id)
    const exist = await userModel.findById(objectId)
    return exist as IUser
  }
}
