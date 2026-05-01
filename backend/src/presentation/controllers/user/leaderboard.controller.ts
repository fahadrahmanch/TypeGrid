import { IGetLeaderboardUseCase } from "../../../application/use-cases/interfaces/user/leaderboard/get-leaderboard.interface";
import { AuthRequest } from "../../../types/AuthRequest";
import { Response } from "express";
import { HttpStatus } from "../../constants/httpStatus";

export class LeaderboardController {
  constructor(private readonly _getLeaderboardUseCase: IGetLeaderboardUseCase) {}

  getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
    const filter = (req.query.filter as string) || "all";
    const limit = parseInt(req.query.limit as string) || 100;

    const leaderboard = await this._getLeaderboardUseCase.execute(filter, limit);

    res.status(HttpStatus.OK).json({
      success: true,
      data: leaderboard,
    });
  };
}
