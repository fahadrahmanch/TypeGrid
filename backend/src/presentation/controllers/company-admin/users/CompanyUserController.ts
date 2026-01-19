import { Request, Response } from "express";
import { IAddUserUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/IAddUserUseCase";
import { ITokenService } from "../../../../domain/interfaces/services/ITokenService";
import { IFindUserUseCase } from "../../../../application/use-cases/interfaces/user/IFindUserUseCase";
import { IGetCompanyUsersUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/IGetCompanyUsersUseCase";
import { IDeleteCompanyUserUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/IDeleteCompanyUserUseCase";
import { MESSAGES } from "../../../../domain/constants/messages";
export class CompanyUserController {
  constructor(
    private _addUserUseCase: IAddUserUseCase,
    private _tokenService:ITokenService,
    private _findUserUseCase:IFindUserUseCase,
    private _getCompanyUsersUseCase:IGetCompanyUsersUseCase,
    private _deleteCompanyUserUseCase:IDeleteCompanyUserUseCase
) {}
  async addUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      if (!userData.name ||!userData.email ||!userData.password ||!userData.role) {
        throw new Error(MESSAGES.ALL_FIELDS_REQUIRED);
      }
      const token = req.cookies.refresh_company;
      if (!token) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      const { email } = await this._tokenService.verifyRefreshToken(token);
      const user = await this._findUserUseCase.execute(email);
      if (!user) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      if (!user.CompanyId) {
        throw new Error(MESSAGES.COMPANY_NOT_ASSIGNED_TO_USER);
      }
      userData.CompanyId=user.CompanyId;
      const data=await this._addUserUseCase.addUser(userData);
       const newUser = {
         name: data.name,
         email: data.email,
         CompanyId: data.CompanyId,
         role: data.role || "companyUser",
         KeyBoardLayout: "QWERTY",
         status: "active",
       };
      res.status(201).json({
      success: true,
      message: MESSAGES.USER_ADDED_SUCCESS,
      data:newUser
    });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: error.message || "Internal Server Error",
        });
    }
  }
  async getUsers(req:Request,res:Response):Promise<void>{
    try{
    const token=req.cookies.refresh_company;
    if (!token) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      const { email } = await this._tokenService.verifyRefreshToken(token);
      const user = await this._findUserUseCase.execute(email);
      if (!user) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      if (!user.CompanyId) {
        throw new Error(MESSAGES.COMPANY_NOT_ASSIGNED_TO_USER);
      }
      const companyUsers=await this._getCompanyUsersUseCase.execute(user.CompanyId);
      const SafecompanyUsers=companyUsers.map(({ password, ...rest }) => rest);
      res.status(200).json({
      success: true,
      message:  MESSAGES.COMPANY_USERS_FETCHED_SUCCESS,
      data: SafecompanyUsers
    });
    }
    catch(error:any){
      console.log(error);
      res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong"
    });
    }
  }

  async deleteCompanyUser(req:Request,res:Response):Promise<void>{
    try{
    const companyUserId=req.params.userId;
    if(!companyUserId){
      throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
    }
    await this._deleteCompanyUserUseCase.deleteUser(companyUserId);
      res.status(200).json({
      success: true,
      message: MESSAGES.USER_DELETED_SUCCESS,
    });


    }
    catch(error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: MESSAGES.INTERNAL_SERVER_ERROR,
      });

    }
  }

}
