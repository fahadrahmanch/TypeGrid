import { Request,Response } from "express";
import { ICreateCompanyContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/ICreateCompanyContestUseCase";
import { AuthRequest } from "../../../types/AuthRequest";
import { IGetCompanyContestsUsecase } from "../../../application/use-cases/interfaces/companyAdmin/IGetCompanyContestsUseCase";
import { IUpdateCompanyContestStatusUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IUpdateCompanyContestStatusUseCase";
export class CompanyContestManagementController{
    constructor(
        private _createCompanyContestUseCase:ICreateCompanyContestUseCase,
        private _getCompanyContestsUseCase:IGetCompanyContestsUsecase,
        private _updateCompanyContestStatusUseCase:IUpdateCompanyContestStatusUseCase
    ){}

    async createContest(req:AuthRequest,res:Response):Promise<void>{
        try{
        
        const data=req.body;
        const userId=req.user?.userId;
        if(!userId){
            throw new Error("User not found");
        }
        await this._createCompanyContestUseCase.execute(data,userId);
        res.status(200).json({
            success:true,
            message:"Contest created successfully"
        });

        }
        catch(error){
            console.log(error);
        }
    }

    async getContests(req:AuthRequest,res:Response):Promise<void>{
        try{
            const userId=req.user?.userId;
            const contests=await this._getCompanyContestsUseCase.execute(userId!);
            res.status(200).json({
                success:true,
                message:"Contests fetched successfully",
                data:contests
            });
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                success:false,
                message:"Failed to fetch contests"
            });
        }
        
        
    }
    async updateContestStatus(req:AuthRequest,res:Response):Promise<void>{
        try{
            console.log("hy tehre");
            const contestId=req.params.contestId;
            const status=req.body.status;
           
            await this._updateCompanyContestStatusUseCase.execute(contestId,status);
            res.status(200).json({
                success:true,
                message:"Contest status updated successfully",
                status:status
            });
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                success:false,
                message:"Failed to update contest status"
            });
        }
    }

}