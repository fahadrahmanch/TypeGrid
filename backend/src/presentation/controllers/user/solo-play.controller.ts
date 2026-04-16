import { Response } from 'express';
import logger from '../../../utils/logger';
import { AuthRequest } from '../../../types/AuthRequest';
import { HttpStatus } from '../../constants/httpStatus';
import { MESSAGES } from '../../../domain/constants/messages';
import { ICreateSoloPlayUseCase } from '../../../application/use-cases/interfaces/user/solo-play/create-solo-play.interface';
import { ISoloPlayResultUseCase } from '../../../application/use-cases/interfaces/user/solo-play/solo-play-result.interface';
import { CustomError } from '../../../domain/entities/custom-error.entity';
export class SoloPlayController {
  constructor(
    private _createSoloPlayUseCase: ICreateSoloPlayUseCase,
    private _soloPlayResultUseCase: ISoloPlayResultUseCase
  ) {}

  createSoloPlay = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const soloPlay = await this._createSoloPlayUseCase.execute(userId);

    logger.info(MESSAGES.SOLO_PLAY_CREATED_SUCCESS, {
      userId,
      soloPlayId: soloPlay._id,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.SOLO_PLAY_CREATED_SUCCESS,
      data: soloPlay,
    });
  };

  result = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const gameId = req.params.gameId;
    const result = req.body;
    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    if (!gameId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.GAME_ID_NOT_FOUND);
    }
    await this._soloPlayResultUseCase.execute(userId, gameId, result);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.SOLO_PLAY_RESULT_SAVED_SUCCESS,
    });
  };
}
