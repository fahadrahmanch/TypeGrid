import { Request, Response } from "express";
import { ITokenService } from "../../../domain/interfaces/services/ITokenService";
import { IFindUserUseCase } from "../../../domain/interfaces/useCases/user/IFindUserUseCase";
import { IUserUpdateUseCase } from "../../../domain/interfaces/useCases/user/IUserUpdateUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
export class userController {
  constructor(
    private _tokenService: ITokenService,
    private _findUserUseCase: IFindUserUseCase,
    private _updateUserUseCase: IUserUpdateUseCase
  ) {}

  async getUserData(req: Request, res: Response) {
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

  async updateUser(req: Request, res: Response): Promise<void> {
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
}
