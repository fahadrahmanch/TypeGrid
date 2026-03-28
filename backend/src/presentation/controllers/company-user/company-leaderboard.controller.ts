import { AuthRequest } from "../../../types/AuthRequest";
import { Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetCompanyLeaderboardUseCase } from "../../../application/use-cases/interfaces/companyUser/get-company-leaderboard.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import logger from "../../../utils/logger";

export class LeaderBoardController {
  constructor(
    private _getCompanyLeaderboardUseCase: IGetCompanyLeaderboardUseCase
  ) {}

  async getLeaderboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const limit = parseInt(req.params.limit as string) || 10;
      logger.info(`Fetching leaderboard for user: ${userId}, limit: ${limit}`);

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const leaderboard = await this._getCompanyLeaderboardUseCase.execute(userId, limit);
      res.status(HttpStatus.OK).json({
        success: true,
        data: leaderboard,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
