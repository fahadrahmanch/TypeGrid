import { Request, Response } from "express";
import { IAddUserUseCase } from "../../../../domain/interfaces/usecases/companyAdmin/IAddUserUseCase";
import { ITokenService } from "../../../../domain/interfaces/services/ITokenService";
import { IFindUserUseCase } from "../../../../domain/interfaces/user/IFindUserUseCase";
export class CompanyUserController {
  constructor(
    private _addUserUseCase: IAddUserUseCase,
    private _tokenService:ITokenService,
    private _findUserUseCase:IFindUserUseCase
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
      await this._addUserUseCase.addUser(userData)
      res.status(201).json({
      success: true,
      message: "User added successfully",
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
    
    }
    catch(error:any){
      console.log(error)
    }
  }
}
