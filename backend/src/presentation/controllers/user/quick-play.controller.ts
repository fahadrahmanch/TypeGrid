import { AuthRequest } from '../../../types/AuthRequest';
import logger from '../../../utils/logger';
import { Response } from 'express';
import { HttpStatus } from '../../constants/httpStatus';
import { MESSAGES } from '../../../domain/constants/messages';
import { IStartQuickPlayUseCase } from '../../../application/use-cases/interfaces/user/quick-play/start-quick-play.interface';
import { IChangeStatusUseCase } from '../../../application/use-cases/interfaces/user/quick-play/change-status.interface';
import { CustomError } from '../../../domain/entities/custom-error.entity';
export class QuickPlayController {
  constructor(
    private _startQuickPlayUseCase: IStartQuickPlayUseCase,
    private _changeStatusUseCase: IChangeStatusUseCase
  ) {}
  startQuickPlay = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const quickPlay = await this._startQuickPlayUseCase.execute(userId);
    if (!quickPlay) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.QUICK_PLAY_START_FAILED);
    }
    logger.info(MESSAGES.QUICK_PLAY_STARTED_SUCCESS, {
      userId,
      quickPlayId: quickPlay._id,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.QUICK_PLAY_STARTED_SUCCESS,
      quickPlay,
    });
  };

  changeStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    const competitionId = req.params.competitionId;
    const userId = req.user?.userId;
    const status = req.body.status;
    if (!status) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.STATUS_REQUIRED);
    }
    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    await this._changeStatusUseCase.execute(competitionId, status);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.QUICK_PLAY_STATUS_CHANGED_SUCCESS,
    });
  };
}
