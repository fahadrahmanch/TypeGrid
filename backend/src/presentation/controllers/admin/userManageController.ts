import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetUsersUseCase } from "../../../application/use-cases/interfaces/admin/IGetUsersUseCase";
import { IBlockUserUseCase } from "../../../application/use-cases/interfaces/admin/IBlockUserUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import logger from "../../../utils/logger";
export class userManageController {
  constructor(
    private _getUsersUseCase: IGetUsersUseCase,
    private _blockUserUseCase: IBlockUserUseCase,
  ) {}
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this._getUsersUseCase.execute();
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
      await this._blockUserUseCase.execute(userId);
      logger.info("User status updated successfully by admin", { userId });
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error: any) {
      next(error);
    }
  }
}
