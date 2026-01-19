import { Request, Response } from "express";
import { IGetUsersUseCase } from "../../../application/use-cases/interfaces/admin/IGetUsersUseCase";
import { IBlockUserUseCase } from "../../../application/use-cases/interfaces/admin/IBlockUserUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import logger from "../../../utils/logger";
export class userManageController {
  constructor(
    private _getUsersUseCase: IGetUsersUseCase,
    private _blockUserUseCase:IBlockUserUseCase
  ) {}
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this._getUsersUseCase.execute();
      const safeUsers = users.map((user) => {
        const { password, ...rest } = user;
        return rest;
      });
      res.status(200).json({
        success: true,
        message: MESSAGES.USERS_FETCHED_SUCCESS,
        data: safeUsers,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        success: false,
        message: MESSAGES.USERS_FETCH_FAILED,
      });
    }
  }

  async updateUserStatus(req:Request,res:Response):Promise<void>{
    try{
    const userId= req.params.userId;
    if(!userId){
      throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
    }
    await this._blockUserUseCase.execute(userId);
    res.status(200).json({ success: true});
    }
    catch(error){
    logger.error(error);
    res.status(500).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
}
