import { Request,Response } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { IGetMyLessonsUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetMyLessonsUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetAssignLessonUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetAssignLessonUseCase";
import { ISaveLessonResultUseCase } from "../../../application/use-cases/interfaces/companyUser/ISaveLessonResultUseCase";
export class MyLessonsController{
    constructor(
    private _getMyLessonsUseCase:IGetMyLessonsUseCase,
    private _getAssignLessonUseCase:IGetAssignLessonUseCase,
    private _saveLessonResultUseCase:ISaveLessonResultUseCase
    ){}
async myLessons(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId as string;

    const myLessons = await this._getMyLessonsUseCase.execute(userId);
    
    res.status(200).json({
      success: true,
      data: myLessons,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: MESSAGES.SOMETHING_WENT_WRONG,
    });
  }
}

async getAssignedLessonById(req: AuthRequest,res: Response): Promise<void> {
  try {
    const { assignmentId } = req.params;
    const userId = req.user?.userId;
    if (!assignmentId) {
      res.status(400).json({
        success: false,
        message: "assignmentId is required",
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const assignedLesson =await this._getAssignLessonUseCase.execute(assignmentId);
    
    res.status(200).json({
      success: true,
      data: assignedLesson,
    });

  } catch (error: any) {
    console.error("getAssignedLessonById error:", error);

    if (error.message === "Assigned lesson not found") {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


async saveLessonResult(req:AuthRequest,res:Response):Promise<void>{
  try{
    const userId=req.user?.userId;
    const assignmentId=req.params.id;
    const result=req.body;
    
    if(!userId){
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND)
    }
    console.log("result in here",result)
    if(!assignmentId){
      res.status(400).json({
      success: false,
      message: "assignmentId is required",
     })
     return;
    }
    await this._saveLessonResultUseCase.execute(userId,assignmentId,result)
    res.status(200).json({
      success: true,
      message: "Lesson result saved successfully",
    });
  }
  catch(error:any){
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


}