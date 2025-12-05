import { Request, Response } from "express";
import { IGetUsersUseCase } from "../../../domain/interfaces/usecases/admin/IGetUsersUseCase";
import { InterfaceUser } from "../../../domain/interfaces/user/InterfaceUser";
import { IBlockUserUseCase } from "../../../domain/interfaces/usecases/admin/IBlockUserUseCase";
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
        message: "Users fetched successfully",
        data: safeUsers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Something went wrong while fetching users",
      });
    }
  }

  async blockUser(req:Request,res:Response):Promise<void>{
    try{
    const userId=req.body.userId
    if(!userId){
      throw new Error("something went wrong")
    }
    await this._blockUserUseCase.execute(userId)
    res.status(200).json({ success: true})
    }
    catch(error){
    res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
