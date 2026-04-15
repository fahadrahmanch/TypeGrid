import { Request, Response,NextFunction } from "express";
import { IGetPracticeTypingContentUseCase } from "../../../application/use-cases/interfaces/companyUser/get-practice-typing-content.interface";
export class TypingPracticeController {
  constructor(
    private _getPracticeTypingContentUseCase: IGetPracticeTypingContentUseCase,
  ) {}
  async generateTypingText(req: Request, res: Response,next:NextFunction) {
    try {
      const { prompt } = req.body;

      const text =
        await this._getPracticeTypingContentUseCase.execute(prompt);
      res.status(200).json({
        success: true,
        text,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to generate typing text",
      });
    }
  }
}