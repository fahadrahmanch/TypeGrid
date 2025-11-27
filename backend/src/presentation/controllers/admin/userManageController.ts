import { Request, Response } from "express";
import { IGetUsersUseCase } from "../../../domain/interfaces/usecases/admin/IGetUsersUseCase";
import { InterfaceUser } from "../../../domain/interfaces/user/InterfaceUser";
export class userManageController {
  constructor(private getUsersUseCase: IGetUsersUseCase) {}
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getUsersUseCase.execute();
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
}
