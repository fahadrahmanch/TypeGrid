import { Request,Response } from "express";
import { ICompanyRequestUseCase } from "../../../domain/interfaces/user/ICompanyRequestUseCase";
export class companyRequestController{
    constructor(
        private _companyRequestUseCase:ICompanyRequestUseCase
    ){}
    async companyDetails(req:Request,res:Response):Promise<void>{
        const token = req.cookies.refreshToken;
        // const decoded = await this._tokenServie.verifyRefreshToken(token);

        const {companyName,address,email,number}=req.body;
        await this._companyRequestUseCase.execute(companyName,address,email,number);
        
    }
}