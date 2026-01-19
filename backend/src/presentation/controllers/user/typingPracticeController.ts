import { Request,Response } from "express";
import { IGetPracticeTypingContentUseCase } from "../../../application/use-cases/interfaces/user/TypingPracticeUseCases/IGetPracticeTypingContentUseCase";
export class typingPracticeController {
  constructor(
    private _getPracticeTypingContentUseCase: IGetPracticeTypingContentUseCase
  ) {}

    async startTypingPractice(req: Request, res: Response): Promise<void> { 
    try {
      const level = req.query.level as string;
      const category = req.query.category as string;
      if(!level || !category){
        throw new Error("Level and Category are required");
      }
      const lesson= await this._getPracticeTypingContentUseCase.execute(level, category);
      if(!lesson){
        throw new Error("Lesson not found");
      }
      res.status(200).json({ success: true, message: "Typing practice started" ,lesson});
    } catch (error) {
      console.log("Error starting typing practice:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async getLessonById(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = req.params.lessonId;
      if(!lessonId){
        throw new Error("Lesson ID is required");
      }
      const lesson= await this._getPracticeTypingContentUseCase.getLessonById(lessonId);
      if(!lesson){
        throw new Error("Lesson not found");
      }
      res.status(200).json({ success: true, lesson });

    } catch (error) {
      console.log("Error fetching lesson by ID:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

} 