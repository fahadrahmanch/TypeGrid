import { Response } from 'express';
import logger from '../../../utils/logger';
import { AuthRequest } from '../../../types/AuthRequest';
import { HttpStatus } from '../../constants/httpStatus';
import { IGetOpenContestsUseCase } from '../../../application/use-cases/interfaces/companyUser/get-open-contests.interface';
import { MESSAGES } from '../../../domain/constants/messages';
import { IJoinOrLeaveContestUseCase } from '../../../application/use-cases/interfaces/companyUser/join-or-leave-contest.interface';
import { IGetGroupContestsUseCase } from '../../../application/use-cases/interfaces/companyUser/get-group-contest.interface';
import { IGetContestUseCase } from '../../../application/use-cases/interfaces/companyUser/get-contest.interface';
import { IGetContestDataUseCase } from '../../../application/use-cases/interfaces/companyUser/get-contest-data.interface';
import { CustomError } from '../../../domain/entities/custom-error.entity';
export class ContestsController {
  constructor(
    private readonly _getOpenContestsUseCase: IGetOpenContestsUseCase,
    private readonly _joinOrLeaveContestUseCase: IJoinOrLeaveContestUseCase,
    private readonly _getGroupContestsUseCase: IGetGroupContestsUseCase,
    private readonly _getContestUseCase: IGetContestUseCase,
    private readonly _getContestDataUseCase: IGetContestDataUseCase
  ) {}
  getOpenContests = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const contests = await this._getOpenContestsUseCase.execute(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.CONTESTS_FETCHED_SUCCESS,
      data: contests,
    });
  };
  getGroupContests = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const groupContests = await this._getGroupContestsUseCase.execute(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.GROUP_CONTESTS_FETCHED_SUCCESS,
      data: groupContests,
    });
  };

  getContest = async (req: AuthRequest, res: Response): Promise<void> => {
    const contestId = req.params.contestId;
    const userId = req.user?.userId;
    if (!contestId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.CONTEST_ID_REQUIRED);
    }
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contest = await this._getContestUseCase.execute(contestId, userId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: contest,
    });
  };
  getContestData = async (req: AuthRequest, res: Response): Promise<void> => {
    const contestId = req.params.contestId;
    const userId = req.user?.userId;
    if (!contestId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.CONTEST_ID_REQUIRED);
    }
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contest = await this._getContestDataUseCase.execute(contestId, userId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: contest,
    });
  };

  joinOrLeaveContest = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const contestId = req.params.contestId;
    const action = req.body.action;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contest = await this._joinOrLeaveContestUseCase.execute(userId, contestId, action);
    logger.info(action === 'join' ? MESSAGES.CONTEST_JOINED_SUCCESS : MESSAGES.CONTEST_LEAVED_SUCCESS, {
      userId,
      contestId,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: action === 'join' ? MESSAGES.CONTEST_JOINED_SUCCESS : MESSAGES.CONTEST_LEAVED_SUCCESS,
      data: contest,
    });
  };
}
