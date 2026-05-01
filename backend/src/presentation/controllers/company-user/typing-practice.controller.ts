import { Request, Response } from "express";
import { IGetPracticeTypingContentUseCase } from "../../../application/use-cases/interfaces/companyUser/get-practice-typing-content.interface";
import { HttpStatus } from "../../constants/httpStatus";

export class TypingPracticeController {
  constructor(private _getPracticeTypingContentUseCase: IGetPracticeTypingContentUseCase) {}
  generateTypingText = async (req: Request, res: Response): Promise<void> => {
    const { prompt } = req.body;

    const text = await this._getPracticeTypingContentUseCase.execute(prompt);
    res.status(HttpStatus.OK).json({
      success: true,
      text,
    });
  };
}
