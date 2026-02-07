import { Request, Response } from "express";
import { ICreateLessonUseCase } from "../../../application/use-cases/interfaces/admin/ICreateLessonUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetLessonUseCase } from "../../../application/use-cases/interfaces/admin/IGetLessonUseCase";
import { IUpdateLessonUseCase } from "../../../application/use-cases/interfaces/admin/IUpdateLessonUseCase";
import { IDeleteLessonUseCase } from "../../../application/use-cases/interfaces/admin/IDeleteLessonUseCase";
export class LessonManageController {
constructor(
    private _createLessonUseCase: ICreateLessonUseCase,
    private _getLessonUseCase:IGetLessonUseCase,
    private _updateLessonUseCase:IUpdateLessonUseCase,
    private _deleteLessonUseCase:IDeleteLessonUseCase
) {}

async createLesson(req: Request, res: Response): Promise<void> {
  try {
    const values = req.body;
    await this._createLessonUseCase.execute(values);
    res.status(201).json({ success: true, message: "Lesson created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async getLessons(req: Request, res: Response): Promise<void> {  
  try {
    const lessons = await this._createLessonUseCase.getLessons();
    res.status(200).json({ success: true, lessons });
  } catch (error) {
    console.log("Error fetching lessons:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } 
}


async fetchLesson(req: Request, res: Response): Promise<void> {
  try {
    const { id: lessonId } = req.params;

    if (!lessonId) {
      res.status(400).json({
        success: false,
        message: MESSAGES.SOMETHING_WENT_WRONG,
      });
      return;
    }

    const lesson = await this._getLessonUseCase.execute(lessonId);

    res.status(200).json({
      success: true,
      data: lesson,
    });

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || MESSAGES.SOMETHING_WENT_WRONG,
    });
  }
}

async updateLesson(req: Request, res: Response): Promise<void> {
  try {
    const { id: lessonId } = req.params;
    

    const values = req.body;
    const updatedLesson=await this._updateLessonUseCase.execute(lessonId, values);
    if(!updatedLesson){
      throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
    }
    res.status(200).json({ success: true, message: "Lesson updated successfully", data:updatedLesson });
  } catch (error: any) {
    console.log("error",error);
    res.status(500).json({ success: false, message: error.message || MESSAGES.SOMETHING_WENT_WRONG });
  }
}


async  deleteLesson(req: Request, res: Response): Promise<void> {
  try {
    const lessonId = req.params.id;
    await this._deleteLessonUseCase.execute(lessonId);
    res.status(200).json({ success: true, message: "Lesson deleted successfully" });
  } catch (error: any) {
    console.log("error", error);
    res.status(500).json({ success: false, message: error.message || MESSAGES.SOMETHING_WENT_WRONG });
  }
}

}

