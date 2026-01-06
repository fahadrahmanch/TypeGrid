import { Request, Response } from "express";
import { ICreateLessonUseCase } from "../../../domain/interfaces/useCases/admin/ICreateLessonUseCase";
export class LessonManageController {
constructor(
    private _createLessonUseCase: ICreateLessonUseCase
) {}

async createLesson(req: Request, res: Response): Promise<void> {
  try {
    const values = req.body;
    console.log("Creating lesson with values:", values);
    await this._createLessonUseCase.execute(values);
    // res.status(201).json({ success: true, message: "Lesson created successfully" });
  } catch (error) {
    console.log("Error creating lesson:", error);
    // res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
}