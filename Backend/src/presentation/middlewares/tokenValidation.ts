import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../../infrastructure/services/tokenVerification";
import { AuthRequest } from "../../domain/interface/auth";
import { ENUM } from "../../constants/statusCode";
import { ERROR, TOKEN } from "../../constants/messages";

export const validateTokens = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const accessToken = req.cookies.access_token;
        const refreshToken = req.cookies.refresh_token;
  
        if (!refreshToken) {
          res.status(ENUM.UNAUTHORIZED).json({ message:TOKEN.REFRESHTOKEN_EXPIRED});
          return;
        }
  
        const refreshTokenValid = verifyRefreshToken(refreshToken);
  
        if (!refreshTokenValid || !refreshTokenValid.id) {
          res
            .status(ENUM.UNAUTHORIZED)
            .json({ success: false, message: TOKEN.REFRESHTOKEN_EXPIRED});
            return;
        }
  
        if (!accessToken) {
          res
            .status(ENUM.UNAUTHORIZED)
            .json({ success: false, message: TOKEN.ACCESSTOKEN_EXPIRED });
            return;
        }
  
        const decoded = verifyAccessToken(accessToken);
        if (!decoded.id || !decoded) {
          res
            .status(ENUM.UNAUTHORIZED)
            .json({ success: false, message: TOKEN.ACCESSTOKEN_EXPIRED });
            return;
        }
        req.user = {
          id: decoded.id,
        };
  
        next();
      } catch (err) {
        res.status(ENUM.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR.INTERNAL });
    }
    };
  