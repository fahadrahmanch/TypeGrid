import { Request, Response } from "express";
import { ITokenService } from "../../../domain/interfaces/services/ITokenService";
import { IFindUserUseCase } from "../../../application/use-cases/interfaces/user/IFindUserUseCase";
import { IUserUpdateUseCase } from "../../../application/use-cases/interfaces/user/IUserUpdateUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { AuthRequest } from "../../../types/AuthRequest";
import { IChangePasswordUseCase } from "../../../application/use-cases/interfaces/user/IChangePasswordUseCase";
export class userController {
  constructor(
    private _tokenService: ITokenService,
    private _findUserUseCase: IFindUserUseCase,
    private _updateUserUseCase: IUserUpdateUseCase,
    private _changePasswordUseCase: IChangePasswordUseCase
  ) {}

  async getProfile(req: Request, res: Response) {
    try {
      const token = req.cookies.refresh_user;
      if (!token) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      const { email } = await this._tokenService.verifyRefreshToken(token);
      const user = await this._findUserUseCase.execute(email);
      if (!user) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      const userDoc = JSON.parse(JSON.stringify(user));
      delete userDoc.password;
      delete userDoc.CompanyId;
      delete userDoc.CompanyRole;
      res.status(200).json(userDoc);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: MESSAGES.USERS_FETCH_FAILED,
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const user = await this._findUserUseCase.execute(data?.email);
      if (!user) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      data._id = user._id;
      await this._updateUserUseCase.execute(data);
      res.status(200).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error) {
      console.log("error ", error);
    }
  }

  async changePassword(req:AuthRequest,res:Response):Promise<void>{
    try{
    const userId=req.user?.userId;
    const data=req.body
    if(!userId){
      throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
    }
    console.log("req.body",req.body)
    console.log("user daata",userId,data)
    await this._changePasswordUseCase.execute(userId, data.currentPassword, data.newPassword);
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
    }
    catch(error:any){
      console.log(error)
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
