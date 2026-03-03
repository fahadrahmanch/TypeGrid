import { Request,Response } from "express";
import { ICreateCompanyContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/ICreateCompanyContestUseCase";
import { AuthRequest } from "../../../types/AuthRequest";
import { IGetCompanyContestsUsecase } from "../../../application/use-cases/interfaces/companyAdmin/IGetCompanyContestsUseCase";
import { IUpdateCompanyContestStatusUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IUpdateCompanyContestStatusUseCase";
import { IGetContestParticipantsUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IGetContestParticipantsUseCase";
import { IGetContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IGetContestUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { IUpdateContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IUpdateContestUseCase";
import { IDeleteContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IDeleteContestUseCase";
export class CompanyContestManagementController{
    constructor(
        private _createCompanyContestUseCase:ICreateCompanyContestUseCase,
        private _getCompanyContestsUseCase:IGetCompanyContestsUsecase,
        private _updateCompanyContestStatusUseCase:IUpdateCompanyContestStatusUseCase,
        private _getContestParticipantsUseCase:IGetContestParticipantsUseCase,
        private _getContestUseCase:IGetContestUseCase,
        private _updateContestUseCase:IUpdateContestUseCase,
        private _deleteContestUseCase:IDeleteContestUseCase
    ){}

    async createContest(req:AuthRequest,res:Response):Promise<void>{
        try{
        
        const data=req.body;
        const userId=req.user?.userId;
        if(!userId){
            throw new Error("User not found");
        }
       const contest= await this._createCompanyContestUseCase.execute(data,userId);
        res.status(200).json({
            data:contest,
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
async getContestsParticipants(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId;
        const contestId = req.params.contestId;

        const participants = await this._getContestParticipantsUseCase.execute(contestId, userId!);

        res.status(200).json({
            success: true,
            data: participants,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
}

async getContestData(req:AuthRequest,res:Response):Promise<void>{
    try{
       const ContestId=req.params.contestId;
  const userId=req.user?.userId;
  if (!ContestId) {
   res.status(400).json({
    success: false,
    message: "Contest ID is required",
  });
  return;
}
  const contest=await this._getContestUseCase.execute(ContestId,userId!);
   res.status(200).json({
      success: true,
      data:contest
    });
    }
    catch(error){
          res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
}

async updateContest(req: AuthRequest, res: Response): Promise<void> {
  try {
    const contestId = req.params.contestId;
    const data = req.body;


    const updatedContest = await this._updateContestUseCase.execute(
      contestId,
      data
    );

    res.status(200).json({
      success: true,
      message: "Contest updated successfully",
      data: updatedContest,
    });

  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
}


async deleteContest(req: Request, res: Response): Promise<void> {
  try {
    const contestId = req.params.contestId;

    if (!contestId) {
      res.status(400).json({
        success: false,
        message: "contestId is required",
      });
      return;
    }


    await this._deleteContestUseCase.delete(contestId);

    res.status(200).json({
      success: true,
      message: "Contest deleted successfully",
    });

  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
}

}