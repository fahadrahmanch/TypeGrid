import { Request, Response, NextFunction } from "express";
import { ICreateDailyAssignChallengeUseCase } from "../../../application/use-cases/interfaces/admin/create-daily-challenge.interface";
import { IGetDailyAssignChallengeUseCase } from "../../../application/use-cases/interfaces/admin/get-daily-challenge.interface";
import { IUpdateDailyAssignChallengeUseCase } from "../../../application/use-cases/interfaces/admin/update-daily-challenge.interface";
import { IDeleteDailyAssignChallengeUseCase } from "../../../application/use-cases/interfaces/admin/delete-daily-challenge.interface";
import { IGetDailyAssignChallengesUseCase } from "../../../application/use-cases/interfaces/admin/get-daily-challenges.interface";

import logger from "../../../utils/logger";

export class DailyAssignChallengeManageController {
  constructor(
    private readonly _createDailyAssignChallengeUseCase: ICreateDailyAssignChallengeUseCase,
    private readonly _getDailyAssignChallengeUseCase: IGetDailyAssignChallengeUseCase,
    private readonly _updateDailyAssignChallengeUseCase: IUpdateDailyAssignChallengeUseCase,
    private readonly _deleteDailyAssignChallengeUseCase: IDeleteDailyAssignChallengeUseCase,
    private readonly _getDailyAssignChallengesUseCase: IGetDailyAssignChallengesUseCase,
  ) {}

  async createDailyAssignChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dailyChallenge = await this._createDailyAssignChallengeUseCase.execute(req.body);
      logger.info("Daily challenge created successfully", dailyChallenge);
      res.status(201).json({
        message: "Daily challenge created successfully",
        data: dailyChallenge
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getDailyAssignChallengeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dailyChallenge = await this._getDailyAssignChallengeUseCase.execute(req.params.id);
      if (!dailyChallenge) {
        res.status(404).json({ message: "Daily challenge not found" });
        return;
      }
      logger.info("Daily challenge fetched successfully", dailyChallenge);
      res.status(200).json({
        message: "Daily challenge fetched successfully",
        data: dailyChallenge
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateDailyAssignChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dailyChallenge = await this._updateDailyAssignChallengeUseCase.execute(id, req.body);
      if (!dailyChallenge) {
        res.status(404).json({ message: "Daily challenge not found" });
        return;
      }
      logger.info("Daily challenge updated successfully", dailyChallenge);
      res.status(200).json({
        message: "Daily challenge updated successfully",
        data: dailyChallenge
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteDailyAssignChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this._deleteDailyAssignChallengeUseCase.execute(req.params.id);
      logger.info("Daily challenge deleted successfully", { id: req.params.id });
      res.status(200).json({
        message: "Daily challenge deleted successfully"
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getDailyAssignChallenges(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const date = (req.query.date as string) || "";
      const result = await this._getDailyAssignChallengesUseCase.execute(date, page, limit);
      logger.info("Daily challenges fetched successfully", result);
      res.status(200).json({
        message: "Daily challenges fetched successfully",
        data: result.dailyChallenges,
        total: result.total
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}