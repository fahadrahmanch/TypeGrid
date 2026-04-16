import { AuthRequest } from '../../../types/AuthRequest';
import { Response } from 'express';
import { HttpStatus } from '../../constants/httpStatus';
import { IGetCompanyLeaderboardUseCase } from '../../../application/use-cases/interfaces/companyUser/get-company-leaderboard.interface';
import { MESSAGES } from '../../../domain/constants/messages';
import logger from '../../../utils/logger';
import { CustomError } from '../../../domain/entities/custom-error.entity';

export class LeaderBoardController {
  constructor(private _getCompanyLeaderboardUseCase: IGetCompanyLeaderboardUseCase) {}

  getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const limit = parseInt(req.params.limit as string) || 10;
    logger.info(`Fetching leaderboard for user: ${userId}, limit: ${limit}`);

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    const leaderboard = await this._getCompanyLeaderboardUseCase.execute(userId, limit);
    res.status(HttpStatus.OK).json({
      success: true,
      data: leaderboard,
    });
  };
}
