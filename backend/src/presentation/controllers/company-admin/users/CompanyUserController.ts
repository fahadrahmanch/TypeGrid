import { Request, Response } from "express";
import { IAddUserUseCase } from "../../../../domain/interfaces/usecases/companyAdmin/IAddUserUseCase";
import { ITokenService } from "../../../../domain/interfaces/services/ITokenService";
import { IFindUserUseCase } from "../../../../domain/interfaces/user/IFindUserUseCase";
import { IGetCompanyUsersUseCase } from "../../../../domain/interfaces/usecases/companyAdmin/IGetCompanyUsersUseCase";
import { Company } from "../../../../infrastructure/db/models/company/companySchema";
import { IDeleteCompanyUserUseCase } from "../../../../domain/interfaces/usecases/companyAdmin/IDeleteCompanyUserUseCase";
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
        throw new Error("All fields are required");
      }
      const token = req.cookies.refresh_company;
      console.log("token",token)
      if (!token) {
        throw new Error("something went wrong");
      }
      const { email } = await this._tokenService.verifyRefreshToken(token);
      console.log("email",email)
      const user = await this._findUserUseCase.execute(email);
      if (!user) {
        throw new Error("something went wrong");
      }
      if (!user.CompanyId) {
        throw new Error("Access denied. Company not assigned to this user.");
      }
      userData.CompanyId=user.CompanyId;
      console.log("userData",userData)
      const data=await this._addUserUseCase.addUser(userData)
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
      message: "User added successfully",
      data:newUser
    });
    } catch (error: any) {
        console.log(error)
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
        throw new Error("something went wrong");
      }
      const { email } = await this._tokenService.verifyRefreshToken(token);
      console.log("email",email)
      const user = await this._findUserUseCase.execute(email);
      if (!user) {
        throw new Error("something went wrong");
      }
      if (!user.CompanyId) {
        throw new Error("Access denied. Company not assigned to this user.");
      }
      const companyUsers=await this._getCompanyUsersUseCase.execute(user.CompanyId)
      console.log("companyUsers",companyUsers)
      const SafecompanyUsers=companyUsers.map(({ password, ...rest }) => rest);
      res.status(200).json({
      success: true,
      message: "Company users fetched successfully.",
      data: SafecompanyUsers
    });
    }
    catch(error:any){
      console.log(error)
      res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong"
    });
    }
  }

  async deleteCompanyUser(req:Request,res:Response):Promise<void>{
    try{
    const companyUserId=req.body._id;
    if(!companyUserId){
      throw new Error("something went wrong")
    }
    await this._deleteCompanyUserUseCase.deleteUser(companyUserId)
      res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });


    }
    catch(error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });

    }
  }

}
