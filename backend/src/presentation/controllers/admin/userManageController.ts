import { Request, Response } from "express";
import { IGetUsersUseCase } from "../../../domain/interfaces/usecases/admin/IGetUsersUseCase";
import { InterfaceUser } from "../../../domain/interfaces/user/InterfaceUser";
import { IBlockUserUseCase } from "../../../domain/interfaces/usecases/admin/IBlockUserUseCase";
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
      const safeUsers = users.map((user: InterfaceUser) => {
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

  async blockUser(req:Request,res:Response):Promise<void>{
    try{
    const userId=req.body.userId;
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
