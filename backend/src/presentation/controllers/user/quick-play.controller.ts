import { AuthRequest } from "../../../types/AuthRequest";
import logger from "../../../utils/logger";
import { Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { IStartQuickPlayUseCase } from "../../../application/use-cases/interfaces/user/quick-play/start-quick-play.interface";
import { IChangeStatusUseCase } from "../../../application/use-cases/interfaces/user/quick-play/change-status.interface";
export class QuickPlayController {
  constructor(
    private _startQuickPlayUseCase: IStartQuickPlayUseCase,
    private _changeStatusUseCase: IChangeStatusUseCase,
  ) {}
  async startQuickPlay(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      const quickPlay = await this._startQuickPlayUseCase.execute(userId);
      if (!quickPlay) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.QUICK_PLAY_START_FAILED,
        });
        return;
      }
      logger.info("Quick play started successfully", {
        userId,
        quickPlayId: quickPlay._id,
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Quick play started successfully",
        quickPlay,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async changeStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const competitionId = req.params.competitionId;
      const userId = req.user?.userId;
      const status = req.body.status;
      if (!status) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.STATUS_REQUIRED,
        });
        return;
      }
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      await this._changeStatusUseCase.execute(competitionId, status);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Quick play status changed successfully",
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
