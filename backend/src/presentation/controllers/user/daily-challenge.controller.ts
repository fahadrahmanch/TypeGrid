import { AuthRequest } from "../../../types/AuthRequest";
import { HttpStatus } from "../../constants/httpStatus";
import { Response, NextFunction } from "express";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetTodayChallengeUseCase } from "../../../application/use-cases/interfaces/user/daily-challenge/get-daily-challenge.interface";
import logger from "../../../utils/logger";
import { IDailyChallengeFinishedUseCase } from "../../../application/use-cases/interfaces/user/daily-challenge/daily-challenge-finished.interface";
import { IGetDailyChallengeStatsUseCase } from "../../../application/use-cases/interfaces/user/daily-challenge/get-daily-challenge-stats.interface";
export class DailyChallengeController{
    constructor(
        private _getTodayChallengeUseCase: IGetTodayChallengeUseCase,
        private _dailyChallengeFinishedUseCase: IDailyChallengeFinishedUseCase,
        private _getDailyChallengeStatsUseCase: IGetDailyChallengeStatsUseCase,
    ) {}
    async getTodayChallenge(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const dailyChallenge = await this._getTodayChallengeUseCase.execute();
            logger.info("Daily challenge fetched successfully", { userId:req.user?.userId, dailyChallengeId: dailyChallenge._id });
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Daily challenge fetched successfully",
                data:dailyChallenge,
            });
        } catch (error: any) {
            next(error);
        }
    }
    async dailyChallengeFinished(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {wpm,accuracy} = req.body;
             await this._dailyChallengeFinishedUseCase.execute(req.user?.userId!,wpm!,accuracy!);
            res.status(HttpStatus.OK).json({
                success: true,
               
            });
        } catch (error: any) {
            next(error);
        }
    }
    async getStatistics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await this._getDailyChallengeStatsUseCase.execute(req.user?.userId!);
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Daily challenge statistics fetched successfully",
                data: stats,
            });
        } catch (error: any) {
            next(error);
        }
    }
}