import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetUsersUseCase } from "../../../application/use-cases/interfaces/admin/get-users.interface";
import { IBlockUserUseCase } from "../../../application/use-cases/interfaces/admin/block-user.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import logger from "../../../utils/logger";


export class UserManageController {
  constructor(
    private _getUsersUseCase: IGetUsersUseCase,
    private _blockUserUseCase: IBlockUserUseCase,
  ) { }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this._getUsersUseCase.execute();
     
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.USERS_FETCHED_SUCCESS,
        data: users||[],
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INVALID_REQUEST,
        });
        return;
      }

      await this._blockUserUseCase.execute(userId);

      logger.info("User status updated successfully by admin", { userId });

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
