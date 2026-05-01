import { Request, Response } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetUsersUseCase } from "../../../application/use-cases/interfaces/admin/get-users.interface";
import { IBlockUserUseCase } from "../../../application/use-cases/interfaces/admin/block-user.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import logger from "../../../utils/logger";
import { CustomError } from "../../../domain/entities/custom-error.entity";

export class UserManageController {
  constructor(
    private _getUsersUseCase: IGetUsersUseCase,
    private _blockUserUseCase: IBlockUserUseCase
  ) {}

  getUsers = async (req: Request, res: Response): Promise<void> => {
    const { search, status, page, limit } = req.query;
    const data = await this._getUsersUseCase.execute(search as string, status as string, Number(page), Number(limit));
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.USERS_FETCHED_SUCCESS,
      users: data.users || [],
      total: data.total,
    });
  };

  updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    if (!userId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    await this._blockUserUseCase.execute(userId);

    logger.info("User status updated successfully by admin", { userId });

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
    });
  };
}
