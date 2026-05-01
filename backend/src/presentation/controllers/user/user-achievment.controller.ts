import { Response } from "express";
import { IGetAllAchievementsUseCase } from "../../../application/use-cases/user/achievements/get-all-achievements.use-case";
import { AuthRequest } from "../../../types/AuthRequest";
import { HttpStatus } from "../../constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { CustomError } from "../../../domain/entities/custom-error.entity";

export class UserAchievementController {
  constructor(private readonly _getAllAchievementsUseCase: IGetAllAchievementsUseCase) {}

  allAchievements = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const search = (req.query.search as string) || "";

    const result = await this._getAllAchievementsUseCase.execute(userId, search);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.ACHIEVEMENTS_FETCH_SUCCESS,
      data: result,
    });
  };
}
