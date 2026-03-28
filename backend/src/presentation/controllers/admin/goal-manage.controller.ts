import { NextFunction, Request, Response } from "express";
import { ICreateGoalUseCase } from "../../../application/use-cases/interfaces/admin/create-goal.interface";
import { IGetGoalUseCase } from "../../../application/use-cases/interfaces/admin/get-goal.interface";
import { IGetGoalsUseCase } from "../../../application/use-cases/interfaces/admin/get-goals.interface";
import { IUpdateGoalUseCase } from "../../../application/use-cases/interfaces/admin/update-goal.interface";
import { IDeleteGoalUseCase } from "../../../application/use-cases/interfaces/admin/delete-goal.interface";
import logger from "../../../utils/logger";

export class GoalManageController {
    constructor(
        private readonly _createGoalUseCase: ICreateGoalUseCase,
        private readonly _getGoalUseCase: IGetGoalUseCase,
        private readonly _updateGoalUseCase: IUpdateGoalUseCase,
        private readonly _deleteGoalUseCase: IDeleteGoalUseCase,
        private readonly _getGoalsUseCase: IGetGoalsUseCase,
    ) { }

    async createGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const goal = await this._createGoalUseCase.execute(req.body);
            logger.info("Goal created successfully", goal);
            res.status(201).json({
                message: "Goal created successfully",
                goal
            })
        } catch (error) {
            next(error);
        }
    }

    async getGoals(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {search,page,limit} = req.query;
            const goals = await this._getGoalsUseCase.execute(search as string,Number(page),Number(limit));
            logger.info("Goals fetched successfully", goals);
            res.status(200).json({
                message: "Goals fetched successfully",
                goals:goals.goals,
                total:goals.total,
                
                
            })
        } catch (error) {
            next(error);
        }
    }
    async getGoalById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.params;
            const goal = await this._getGoalUseCase.execute(id as string);
            logger.info("Goal fetched successfully", goal);
            res.status(200).json({
                message: "Goal fetched successfully",
                goal
            })
        } catch (error) {
            next(error);
        }
    }
    async updateGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.params;
            const goal = await this._updateGoalUseCase.execute(id as string,req.body);
            logger.info("Goal updated successfully", goal);
            res.status(200).json({
                message: "Goal updated successfully",
                goal
            })
        } catch (error) {
            next(error);
        }
    }
    async deleteGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.params;
            const goal = await this._deleteGoalUseCase.execute(id as string);
            logger.info("Goal deleted successfully", goal);
            res.status(200).json({
                message: "Goal deleted successfully",
                goal
            })
        } catch (error) {
            next(error);
        }
    }
}