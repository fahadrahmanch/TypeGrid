import { Request, Response } from 'express';
import { ICreateDailyAssignChallengeUseCase } from '../../../application/use-cases/interfaces/admin/create-daily-challenge.interface';
import { IGetDailyAssignChallengeUseCase } from '../../../application/use-cases/interfaces/admin/get-daily-challenge.interface';
import { IUpdateDailyAssignChallengeUseCase } from '../../../application/use-cases/interfaces/admin/update-daily-challenge.interface';
import { IDeleteDailyAssignChallengeUseCase } from '../../../application/use-cases/interfaces/admin/delete-daily-challenge.interface';
import { IGetDailyAssignChallengesUseCase } from '../../../application/use-cases/interfaces/admin/get-daily-challenges.interface';

import logger from '../../../utils/logger';
import { HttpStatus } from '../../constants/httpStatus';
import { MESSAGES } from '../../../domain/constants/messages';

export class DailyAssignChallengeManageController {
  constructor(
    private readonly _createDailyAssignChallengeUseCase: ICreateDailyAssignChallengeUseCase,
    private readonly _getDailyAssignChallengeUseCase: IGetDailyAssignChallengeUseCase,
    private readonly _updateDailyAssignChallengeUseCase: IUpdateDailyAssignChallengeUseCase,
    private readonly _deleteDailyAssignChallengeUseCase: IDeleteDailyAssignChallengeUseCase,
    private readonly _getDailyAssignChallengesUseCase: IGetDailyAssignChallengesUseCase
  ) {}

  createDailyAssignChallenge = async (req: Request, res: Response): Promise<void> => {
    const dailyChallenge = await this._createDailyAssignChallengeUseCase.execute(req.body);
    logger.info(MESSAGES.DAILY_CHALLENGE_CREATED_SUCCESS, dailyChallenge);
    res.status(HttpStatus.CREATED).json({
      message: MESSAGES.DAILY_CHALLENGE_CREATED_SUCCESS,
      data: dailyChallenge,
    });
  };

  getDailyAssignChallengeById = async (req: Request, res: Response): Promise<void> => {
    const dailyChallenge = await this._getDailyAssignChallengeUseCase.execute(req.params.id);
    if (!dailyChallenge) {
      res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.DAILY_CHALLENGE_NOT_FOUND });
      return;
    }
    logger.info(MESSAGES.DAILY_CHALLENGE_FETCHED_SUCCESS, dailyChallenge);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.DAILY_CHALLENGE_FETCHED_SUCCESS,
      data: dailyChallenge,
    });
  };

  updateDailyAssignChallenge = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const dailyChallenge = await this._updateDailyAssignChallengeUseCase.execute(id, req.body);
    if (!dailyChallenge) {
      res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.DAILY_CHALLENGE_NOT_FOUND });
      return;
    }
    logger.info(MESSAGES.DAILY_CHALLENGE_UPDATED_SUCCESS, dailyChallenge);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.DAILY_CHALLENGE_UPDATED_SUCCESS,
      data: dailyChallenge,
    });
  };

  deleteDailyAssignChallenge = async (req: Request, res: Response): Promise<void> => {
    await this._deleteDailyAssignChallengeUseCase.execute(req.params.id);
    logger.info(MESSAGES.DAILY_CHALLENGE_DELETED_SUCCESS, {
      id: req.params.id,
    });
    res.status(HttpStatus.OK).json({
      message: MESSAGES.DAILY_CHALLENGE_DELETED_SUCCESS,
    });
  };

  getDailyAssignChallenges = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const date = (req.query.date as string) || '';
    const result = await this._getDailyAssignChallengesUseCase.execute(date, page, limit);
    logger.info(MESSAGES.DAILY_CHALLENGES_FETCHED_SUCCESS, result);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.DAILY_CHALLENGES_FETCHED_SUCCESS,
      data: result.dailyChallenges,
      total: result.total,
    });
  };
}
