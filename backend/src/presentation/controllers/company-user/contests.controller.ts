import { Request, Response, NextFunction } from "express";
import logger from "../../../utils/logger";
import { AuthRequest } from "../../../types/AuthRequest";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetOpenContestsUseCase } from "../../../application/use-cases/interfaces/companyUser/get-open-contests.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { IJoinOrLeaveContestUseCase } from "../../../application/use-cases/interfaces/companyUser/join-or-leave-contest.interface";
import { IGetGroupContestsUseCase } from "../../../application/use-cases/interfaces/companyUser/get-group-contest.interface";
import { IGetContestUseCase } from "../../../application/use-cases/interfaces/companyUser/get-contest.interface";
import { IGetContestDataUseCase } from "../../../application/use-cases/interfaces/companyUser/get-contest-data.interface";
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
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }

      const contests = await this._getOpenContestsUseCase.execute(userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Contests fetched successfully",
        data: contests,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  async getGroupContests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      const groupContests = await this._getGroupContestsUseCase.execute(userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Group contests fetched successfully",
        data: groupContests,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getContest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const contestId = req.params.contestId;
      const userId = req.user?.userId;
      if (!contestId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Contest ID is required",
        });
        return;
      }
      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      const contest = await this._getContestUseCase.execute(contestId, userId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: contest,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  async getContestData(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const contestId = req.params.contestId;
      const userId = req.user?.userId;
      if (!contestId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Contest ID is required",
        });
        return;
      }
      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      const contest = await this._getContestDataUseCase.execute(
        contestId,
        userId,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        data: contest,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async joinOrLeaveContest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const contestId = req.params.contestId;
      const action = req.body.action;
      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
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
    } catch (error: unknown) {
      next(error);
    }
  }
}
