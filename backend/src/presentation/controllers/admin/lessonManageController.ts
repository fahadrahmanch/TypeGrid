import { Request, Response } from "express";
import { ICreateLessonUseCase } from "../../../application/use-cases/interfaces/admin/ICreateLessonUseCase";
export class LessonManageController {
constructor(
    private _createLessonUseCase: ICreateLessonUseCase
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
}
