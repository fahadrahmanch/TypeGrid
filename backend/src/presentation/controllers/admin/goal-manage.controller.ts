import { Request, Response } from 'express';
import { ICreateGoalUseCase } from '../../../application/use-cases/interfaces/admin/create-goal.interface';
import { IGetGoalUseCase } from '../../../application/use-cases/interfaces/admin/get-goal.interface';
import { IGetGoalsUseCase } from '../../../application/use-cases/interfaces/admin/get-goals.interface';
import { IUpdateGoalUseCase } from '../../../application/use-cases/interfaces/admin/update-goal.interface';
import { IDeleteGoalUseCase } from '../../../application/use-cases/interfaces/admin/delete-goal.interface';
import logger from '../../../utils/logger';
import { HttpStatus } from '../../constants/httpStatus';
import { MESSAGES } from '../../../domain/constants/messages';

export class GoalManageController {
  constructor(
    private readonly _createGoalUseCase: ICreateGoalUseCase,
    private readonly _getGoalUseCase: IGetGoalUseCase,
    private readonly _updateGoalUseCase: IUpdateGoalUseCase,
    private readonly _deleteGoalUseCase: IDeleteGoalUseCase,
    private readonly _getGoalsUseCase: IGetGoalsUseCase
  ) {}

  createGoal = async (req: Request, res: Response): Promise<void> => {
    const goal = await this._createGoalUseCase.execute(req.body);
    logger.info(MESSAGES.GOAL_CREATED_SUCCESS, goal);
    res.status(HttpStatus.CREATED).json({
      message: MESSAGES.GOAL_CREATED_SUCCESS,
      goal,
    });
  };

  getGoals = async (req: Request, res: Response): Promise<void> => {
    const { search, page, limit } = req.query;
    const goals = await this._getGoalsUseCase.execute(search as string, Number(page), Number(limit));
    logger.info(MESSAGES.GOALS_FETCHED_SUCCESS, goals);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.GOALS_FETCHED_SUCCESS,
      goals: goals.goals,
      total: goals.total,
    });
  };
  getGoalById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const goal = await this._getGoalUseCase.execute(id as string);
    logger.info(MESSAGES.GOAL_FETCHED_SUCCESS, goal);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.GOAL_FETCHED_SUCCESS,
      goal,
    });
  };
  updateGoal = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const goal = await this._updateGoalUseCase.execute(id as string, req.body);
    logger.info(MESSAGES.GOAL_UPDATED_SUCCESS, goal);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.GOAL_UPDATED_SUCCESS,
      goal,
    });
  };
  deleteGoal = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const goal = await this._deleteGoalUseCase.execute(id as string);
    logger.info(MESSAGES.GOAL_DELETED_SUCCESS, goal);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.GOAL_DELETED_SUCCESS,
      goal,
    });
  };
}
