import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { ISetKeyboardLayoutUseCase } from "../../../application/use-cases/interfaces/companyUser/set-keyboard-layout.interface";
import { HttpStatus } from "../../constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";

export class SetKeyboardLayoutController {
  constructor(
    private readonly setKeyboardLayoutUseCase: ISetKeyboardLayoutUseCase,
  ) {}

  async execute(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        console.log("set keyboard layout")
      const userId = req.user?.userId;
      const { keyboardLayout } = req.body;
      console.log("keyboard layout", keyboardLayout);

      if (!userId || !keyboardLayout) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ALL_FIELDS_REQUIRED,
        });
        return;
      }

      await this.setKeyboardLayoutUseCase.execute(userId, keyboardLayout);

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error:unknown) {
      console.error("Error setting keyboard layout:", error);
      next(error);
    }
  }
}