import { AuthRequest } from "../../../types/AuthRequest";
import { HttpStatus } from "../../constants/httpStatus";
import { Response } from "express";
import { IGetTodayChallengeUseCase } from "../../../application/use-cases/interfaces/user/daily-challenge/get-daily-challenge.interface";
import logger from "../../../utils/logger";
import { IDailyChallengeFinishedUseCase } from "../../../application/use-cases/interfaces/user/daily-challenge/daily-challenge-finished.interface";
import { IGetDailyChallengeStatsUseCase } from "../../../application/use-cases/interfaces/user/daily-challenge/get-daily-challenge-stats.interface";
import { MESSAGES } from "../../../domain/constants/messages";
export class DailyChallengeController {
  constructor(
    private _getTodayChallengeUseCase: IGetTodayChallengeUseCase,
    private _dailyChallengeFinishedUseCase: IDailyChallengeFinishedUseCase,
    private _getDailyChallengeStatsUseCase: IGetDailyChallengeStatsUseCase
  ) {}
  getTodayChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
    const dailyChallenge = await this._getTodayChallengeUseCase.execute();
    logger.info(MESSAGES.DAILY_CHALLENGE_FETCHED_SUCCESS, {
      userId: req.user?.userId,
      dailyChallengeId: dailyChallenge._id,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.DAILY_CHALLENGE_FETCHED_SUCCESS,
      data: dailyChallenge,
    });
  };
  dailyChallengeFinished = async (req: AuthRequest, res: Response): Promise<void> => {
    const { wpm, accuracy } = req.body;
    await this._dailyChallengeFinishedUseCase.execute(req.user?.userId!, wpm!, accuracy!);
    res.status(HttpStatus.OK).json({
      success: true,
    });
  };
  getStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
    const stats = await this._getDailyChallengeStatsUseCase.execute(req.user?.userId!);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.DAILY_CHALLENGE_STATS_FETCHED_SUCCESS || "Daily challenge statistics fetched successfully",
      data: stats,
    });
  };
}
