import { Response } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { ISetKeyboardLayoutUseCase } from "../../../application/use-cases/interfaces/companyUser/set-keyboard-layout.interface";
import { HttpStatus } from "../../constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { CustomError } from "../../../domain/entities/custom-error.entity";

export class SetKeyboardLayoutController {
  constructor(private readonly setKeyboardLayoutUseCase: ISetKeyboardLayoutUseCase) {}

  execute = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { keyboardLayout } = req.body;

    if (!userId || !keyboardLayout) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
    }

    await this.setKeyboardLayoutUseCase.execute(userId, keyboardLayout);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
    });
  };
}
