import { Response } from 'express';
import { HttpStatus } from '../../constants/httpStatus';
import { IFindUserUseCase } from '../../../application/use-cases/interfaces/user/find-user.interface';
import { IUserUpdateUseCase } from '../../../application/use-cases/interfaces/user/user-update.interface';
import { MESSAGES } from '../../../domain/constants/messages';
import { AuthRequest } from '../../../types/AuthRequest';
import { IChangePasswordUseCase } from '../../../application/use-cases/interfaces/user/change-password.interface';
import { mapToUserProfileDTO } from '../../../application/mappers/user/user.mapper';
import { CustomError } from '../../../domain/entities/custom-error.entity';

export class UserController {
  constructor(
    private _findUserUseCase: IFindUserUseCase,
    private _updateUserUseCase: IUserUpdateUseCase,
    private _changePasswordUseCase: IChangePasswordUseCase
  ) {}

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const email = req.user?.email;
    if (!email) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    const user = await this._findUserUseCase.execute(email);
    if (!user) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.USER_DETAILS_NOT_FOUND);
    }

    const userProfile = mapToUserProfileDTO(user);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.FETCH_SUCCESS,
      user: userProfile,
    });
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const data = req.body;
    const email = req.user?.email;

    if (!email) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    const user = await this._findUserUseCase.execute(email);
    if (!user) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.USER_DETAILS_NOT_FOUND);
    }

    data._id = user._id;
    await this._updateUserUseCase.execute(data);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
    });
  };

  changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const data = req.body;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    await this._changePasswordUseCase.execute(userId, data.currentPassword, data.newPassword);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.PASSWORD_UPDATE_SUCCESS,
    });
  };

  getUsecCompanyDetails=async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }
    console.log("userId",userId)
  }
}
