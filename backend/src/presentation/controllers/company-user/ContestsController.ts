import { Request, Response } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { IGetOpenContestsUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetOpenContestsUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { IJoinOrLeaveContestUseCase } from "../../../application/use-cases/interfaces/companyUser/IoinOrLeaveContestUseCase";
import { IGetGroupContestsUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetGroupContestUseCase";
import { IGetContestUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetContestUseCase";
import { IGetContestDataUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetContestDataUseCase";
export class ContestsController{
    constructor(
        private readonly _getOpenContestsUseCase:IGetOpenContestsUseCase,
        private readonly _joinOrLeaveContestUseCase:IJoinOrLeaveContestUseCase,
        private readonly _getGroupContestsUseCase:IGetGroupContestsUseCase,
        private readonly _getContestUseCase:IGetContestUseCase,
        private readonly _getContestDataUseCase:IGetContestDataUseCase,
    )
    {}
   async getOpenContests(req: AuthRequest, res: Response) {
  try {
   
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: MESSAGES.AUTH_USER_NOT_FOUND,
      });
    }

    const contests = await this._getOpenContestsUseCase.execute(userId);

    return res.status(200).json({
      success: true,
      message: "Contests fetched successfully",
      data: contests,
    });

  } catch (error:any) {
    console.error("Error in getOpenContests:", error);
    res.status(500).json({
      success: false,
      message:error.message,
    });
  }
}
async getGroupContests(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: MESSAGES.AUTH_USER_NOT_FOUND,
      });
    }
    const groupContests=await this._getGroupContestsUseCase.execute(userId);
    return res.status(200).json({
      success: true,
      message: "Group contests fetched successfully",
      data: groupContests,
    });



  } catch (error:any) {
    console.error("Error in getGroupContests:", error);
    res.status(500).json({
      success: false,
      message:error.message,
    });
  }
}


async getContest(req:AuthRequest,res:Response):Promise<void>{
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
  catch(error:any){
    console.log(error);
    res.status(500).json({
      success: false,
      message:error.message,
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
  const contest=await this._getContestDataUseCase.execute(ContestId,userId!);
   res.status(200).json({
      success: true,
      data:contest
    });
  }
  catch(error:any){
    console.log(error);
    res.status(500).json({
      success: false,
      message:error.message,
    });
  }
}



async joinOrLeaveContest(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const contestId = req.params.contestId;
    const action = req.body.action;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: MESSAGES.AUTH_USER_NOT_FOUND,
      });
    }
    const contest=await this._joinOrLeaveContestUseCase.execute(userId, contestId,action);
    return res.status(200).json({
      success: true,
      message: `Contest ${action} successfully`,
      data: contest,
    });
  } catch (error:any) {
    console.error("Error in joinOrLeaveContest:", error);
    res.status(500).json({
      success: false,
      message:error.message,
    });
  } 

}

}