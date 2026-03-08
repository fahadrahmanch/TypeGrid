import { AuthRequest } from "../../../types/AuthRequest";
import logger from "../../../utils/logger";
import { Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { IStartQuickPlayUseCase } from "../../../application/use-cases/interfaces/user/quickPlayUseCases/IStartQuickPlayUseCase";
import { IChangeStatusUseCase } from "../../../application/use-cases/interfaces/user/quickPlayUseCases/IChangeStatusUseCase";
export class QuickPlayController {
  constructor(
    private _startQuickPlayUseCase: IStartQuickPlayUseCase,
    private _changeStatusUseCase: IChangeStatusUseCase,
  ) {}
  async startQuickPlay(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const quickPlay = await this._startQuickPlayUseCase.execute(userId);
      if (!quickPlay) {
        throw new Error(MESSAGES.QUICK_PLAY_START_FAILED);
      }
      logger.info("Quick play started successfully", { userId, quickPlayId: quickPlay._id });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Quick play started successfully",
        quickPlay,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async changeStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const competitionId = req.params.competitionId;
      const userId = req.user?.userId;
      const status = req.body.status;
      if (!status) {
        throw new Error(MESSAGES.STATUS_REQUIRED);
      }
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      await this._changeStatusUseCase.execute(competitionId, status);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Quick play status changed successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }
}
