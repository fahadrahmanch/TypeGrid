import { Request, Response } from 'express';
import { MESSAGES } from '../../../domain/constants/messages';
import { IGetProfileUseCase } from '../../../application/use-cases/interfaces/companyUser/get-profile.interface';
import { IUpdateCompanyPasswordUseCase } from '../../../application/use-cases/interfaces/companyUser/update-password.interface';
import { HttpStatus } from '../../constants/httpStatus';
import { CustomError } from '../../../domain/entities/custom-error.entity';
export class CompanyUserController {
  constructor(
    private readonly _getProfileUseCase: IGetProfileUseCase,
    private readonly _updatePasswordUseCase: IUpdateCompanyPasswordUseCase
  ) {}

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
}
