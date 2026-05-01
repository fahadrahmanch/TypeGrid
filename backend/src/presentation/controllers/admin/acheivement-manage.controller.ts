import { Request, Response } from "express";
import { ICreateAchievementUseCase } from "../../../application/use-cases/interfaces/admin/create-achievement.interface";
import { IUpdateAchievementUseCase } from "../../../application/use-cases/interfaces/admin/update-achievement.interface";
import { IDeleteAchievementUseCase } from "../../../application/use-cases/interfaces/admin/delete-achievement.interface";
import { IGetAchievementsUseCase } from "../../../application/use-cases/interfaces/admin/get-achievements.interface";
import { IGetAchievementByIdUseCase } from "../../../application/use-cases/interfaces/admin/get-achievement-by-id.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { HttpStatus } from "../../constants/httpStatus";

export class AchievementManageController {
  constructor(
    private readonly _createAchievementUseCase: ICreateAchievementUseCase,
    private readonly _getAchievementsUseCase: IGetAchievementsUseCase,
    private readonly _getAchievementByIdUseCase: IGetAchievementByIdUseCase,
    private readonly _updateAchievementUseCase: IUpdateAchievementUseCase,
    private readonly _deleteAchievementUseCase: IDeleteAchievementUseCase
  ) {}

  createAchievement = async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    const achievement = await this._createAchievementUseCase.createAchievement(data);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: MESSAGES.CREATE_SUCCESS,
      data: achievement,
    });
  };

  getAllAchievements = async (req: Request, res: Response): Promise<void> => {
    const search = (req.query.search as string) || "";
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

    const result = await this._getAchievementsUseCase.execute(search, limit, page);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.ACHIEVEMENTS_FETCH_SUCCESS,
      data: result.achievements,
      total: result.total,
    });
  };

  getAchievementById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const achievement = await this._getAchievementByIdUseCase.execute(id);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.ACHIEVEMENT_FETCH_SUCCESS,
      data: achievement,
    });
  };

  updateAchievement = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const data = req.body;
    const result = await this._updateAchievementUseCase.execute(id, data);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
      data: result,
    });
  };

  deleteAchievement = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    await this._deleteAchievementUseCase.execute(id);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.DELETE_SUCCESS,
    });
  };
}
