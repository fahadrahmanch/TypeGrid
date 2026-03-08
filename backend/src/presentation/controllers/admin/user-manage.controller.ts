import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetUsersUseCase } from "../../../application/use-cases/interfaces/admin/get-users.interface";
import { IBlockUserUseCase } from "../../../application/use-cases/interfaces/admin/block-user.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import logger from "../../../utils/logger";
export class UserManageController {
  constructor(
    private _GetUsersUseCase: IGetUsersUseCase,
    private _BlockUserUseCase: IBlockUserUseCase,
  ) {}
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this._GetUsersUseCase.execute();
      const safeUsers = users.map((user) => {
        const { password, ...rest } = user;
        return rest;
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.USERS_FETCHED_SUCCESS,
        data: safeUsers,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      await this._BlockUserUseCase.execute(userId);
      logger.info("User status updated successfully by admin", { userId });
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error: any) {
      next(error);
    }
  }
}
