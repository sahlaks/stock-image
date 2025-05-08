import express from 'express';
import { UserRepository } from '../../infrastructure/repositories/userRepository';
import { UserUseCase } from '../../usecases/userUsecases';
import { UserController } from '../controllers/userController';
import upload from '../../infrastructure/services/upload';
import { validateTokens } from '../middlewares/tokenValidation';

const userRouter = express.Router();
const userRepository = new UserRepository()
const userUsecase = new UserUseCase(userRepository)
const controller = new UserController(userUsecase)

userRouter.post('/signup', (req,res,next)=>{controller.createUser(req,res,next)})
userRouter.post('/login', (req,res,next)=>{controller.loginUser(req,res,next)})
userRouter.post('/uploads', validateTokens, upload, (req,res,next)=>{controller.imageUpload(req,res,next)})
userRouter.get('/fetch-images', validateTokens, (req,res,next)=>{controller.fetchImages(req,res,next)})
userRouter.delete('/delete-image/:id', validateTokens, (req,res,next)=>{controller.deleteImage(req,res,next)})
userRouter.put('/edit-image', validateTokens, upload, (req,res,next)=>{controller.editImage(req,res,next)})
userRouter.post('/position-update', validateTokens, (req,res,next)=>{controller.updatePositions(req,res,next)})
userRouter.post('/reset-password',validateTokens,(req,res,next)=>{controller.resetPassword(req,res,next)})
userRouter.post('/refreshToken', (req, res, next) =>{controller.refreshToken(req, res, next)})
userRouter.post('/logout', (req,res,next)=>{controller.logoutUser(req,res,next)})
export default userRouter;