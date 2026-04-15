import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetProfileUseCase } from "../../../application/use-cases/interfaces/companyUser/get-profile.interface";
import { IUpdateCompanyPasswordUseCase } from "../../../application/use-cases/interfaces/companyUser/update-password.interface";
import { HttpStatus } from "../../constants/httpStatus";
export class CompanyUserController {
  constructor(
    private readonly _getProfileUseCase: IGetProfileUseCase,
    private readonly _updatePasswordUseCase: IUpdateCompanyPasswordUseCase,
  ) {}

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const profile = await this._getProfileUseCase.getProfile(userId);
      if (!profile) {
         res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.USER_DETAILS_NOT_FOUND,
        });
        return;
      }

       res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.PROFILE_FETCHED_SUCCESSFULLY,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.USER_DETAILS_NOT_FOUND,
        });
        return;
      }

      await this._updatePasswordUseCase.execute(
        userId,
        currentPassword,
        newPassword,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.PASSWORD_UPDATE_SUCCESS,  
      });
    } catch (error) {
      next(error);
    }
  }


}
