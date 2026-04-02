import { Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { IFindUserUseCase } from "../../../application/use-cases/interfaces/user/find-user.interface";
import { IUserUpdateUseCase } from "../../../application/use-cases/interfaces/user/user-update.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { AuthRequest } from "../../../types/AuthRequest";
import { IChangePasswordUseCase } from "../../../application/use-cases/interfaces/user/change-password.interface";
import { mapToUserProfileDTO } from "../../../application/mappers/user/user.mapper";

export class UserController {
  constructor(
    private _findUserUseCase: IFindUserUseCase,
    private _updateUserUseCase: IUserUpdateUseCase,
    private _changePasswordUseCase: IChangePasswordUseCase,
  ) {}

  async getProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const email = req.user?.email;
      if (!email) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const user = await this._findUserUseCase.execute(email);
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.USER_DETAILS_NOT_FOUND,
        });
        return;
      }

      const userProfile = mapToUserProfileDTO(user);

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.FETCH_SUCCESS,
        user: userProfile,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const email = req.user?.email;

      if (!email) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const user = await this._findUserUseCase.execute(email);
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.USER_DETAILS_NOT_FOUND,
        });
        return;
      }

      data._id = user._id;
      await this._updateUserUseCase.execute(data);

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async changePassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const data = req.body;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      await this._changePasswordUseCase.execute(
        userId,
        data.currentPassword,
        data.newPassword,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.PASSWORD_UPDATE_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
