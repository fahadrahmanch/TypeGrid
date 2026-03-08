import { Request, Response, NextFunction } from "express";
import logger from "../../../utils/logger";
import { AuthRequest } from "../../../types/AuthRequest";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetOpenContestsUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetOpenContestsUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { IJoinOrLeaveContestUseCase } from "../../../application/use-cases/interfaces/companyUser/IoinOrLeaveContestUseCase";
import { IGetGroupContestsUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetGroupContestUseCase";
import { IGetContestUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetContestUseCase";
import { IGetContestDataUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetContestDataUseCase";
export class ContestsController {
  constructor(
    private readonly _getOpenContestsUseCase: IGetOpenContestsUseCase,
    private readonly _joinOrLeaveContestUseCase: IJoinOrLeaveContestUseCase,
    private readonly _getGroupContestsUseCase: IGetGroupContestsUseCase,
    private readonly _getContestUseCase: IGetContestUseCase,
    private readonly _getContestDataUseCase: IGetContestDataUseCase,
  ) {}
  async getOpenContests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }

      const contests = await this._getOpenContestsUseCase.execute(userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Contests fetched successfully",
        data: contests,
      });
    } catch (error: any) {
      next(error);
    }
  }
  async getGroupContests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const groupContests = await this._getGroupContestsUseCase.execute(userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Group contests fetched successfully",
        data: groupContests,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getContest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ContestId = req.params.contestId;
      const userId = req.user?.userId;
      if (!ContestId) {
        throw new Error("Contest ID is required");
      }
      const contest = await this._getContestUseCase.execute(ContestId, userId!);
      res.status(HttpStatus.OK).json({
        success: true,
        data: contest,
      });
    } catch (error: any) {
      next(error);
    }
  }
  async getContestData(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ContestId = req.params.contestId;
      const userId = req.user?.userId;
      if (!ContestId) {
        throw new Error("Contest ID is required");
      }
      const contest = await this._getContestDataUseCase.execute(
        ContestId,
        userId!,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        data: contest,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async joinOrLeaveContest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const contestId = req.params.contestId;
      const action = req.body.action;
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const contest = await this._joinOrLeaveContestUseCase.execute(
        userId,
        contestId,
        action,
      );
      logger.info(`Contest ${action} successfully`, { userId, contestId });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: `Contest ${action} successfully`,
        data: contest,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
