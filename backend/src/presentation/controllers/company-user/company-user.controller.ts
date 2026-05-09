import { Request, Response } from "express";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetProfileUseCase } from "../../../application/use-cases/interfaces/companyUser/get-profile.interface";
import { IUpdateCompanyPasswordUseCase } from "../../../application/use-cases/interfaces/companyUser/update-password.interface";
import { HttpStatus } from "../../constants/httpStatus";
import { CustomError } from "../../../domain/entities/custom-error.entity";
import { IUpdateProfileUseCase } from "../../../application/use-cases/interfaces/companyUser/update-profile.interface";

export class CompanyUserController {
  constructor(
    private readonly _getProfileUseCase: IGetProfileUseCase,
    private readonly _updatePasswordUseCase: IUpdateCompanyPasswordUseCase,
    private readonly _updateProfileUseCase: IUpdateProfileUseCase
  ) { }

  getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const profile = await this._getProfileUseCase.getProfile(userId);
    if (!profile) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.USER_DETAILS_NOT_FOUND);
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.PROFILE_FETCHED_SUCCESSFULLY,
      data: profile,
    });
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.USER_DETAILS_NOT_FOUND);
    }

    await this._updatePasswordUseCase.execute(userId, currentPassword, newPassword);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.PASSWORD_UPDATE_SUCCESS,
    });
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const data = req.body.imageUrl;

    if (!userId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.USER_DETAILS_NOT_FOUND);
    }

    await this._updateProfileUseCase.execute(userId, data);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
    });
  };
}
