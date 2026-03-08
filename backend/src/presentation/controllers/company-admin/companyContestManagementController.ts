import { Request, Response, NextFunction } from "express";
import logger from "../../../utils/logger";
import { HttpStatus } from "../../constants/httpStatus";
import { ICreateCompanyContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/ICreateCompanyContestUseCase";
import { AuthRequest } from "../../../types/AuthRequest";
import { IGetCompanyContestsUsecase } from "../../../application/use-cases/interfaces/companyAdmin/IGetCompanyContestsUseCase";
import { IUpdateCompanyContestStatusUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IUpdateCompanyContestStatusUseCase";
import { IGetContestParticipantsUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IGetContestParticipantsUseCase";
import { IGetContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IGetContestUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { IUpdateContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IUpdateContestUseCase";
import { IDeleteContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IDeleteContestUseCase";
export class CompanyContestManagementController {
  constructor(
    private _createCompanyContestUseCase: ICreateCompanyContestUseCase,
    private _getCompanyContestsUseCase: IGetCompanyContestsUsecase,
    private _updateCompanyContestStatusUseCase: IUpdateCompanyContestStatusUseCase,
    private _getContestParticipantsUseCase: IGetContestParticipantsUseCase,
    private _getContestUseCase: IGetContestUseCase,
    private _updateContestUseCase: IUpdateContestUseCase,
    private _deleteContestUseCase: IDeleteContestUseCase,
  ) {}

  async createContest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const contest = await this._createCompanyContestUseCase.execute(
        data,
        userId,
      );
      logger.info("Company contest created successfully", { userId });

      res.status(HttpStatus.OK).json({
        data: contest,
        success: true,
        message: MESSAGES.CREATE_SUCCESS,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getContests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const contests = await this._getCompanyContestsUseCase.execute(userId!);
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.FETCH_SUCCESS,
        data: contests,
      });
    } catch (error: any) {
      next(error);
    }
  }
  async updateContestStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const contestId = req.params.contestId;
      const status = req.body.status;

      await this._updateCompanyContestStatusUseCase.execute(contestId, status);
      logger.info("Contest status updated successfully", { contestId, status });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
        status: status,
      });
    } catch (error: any) {
      next(error);
    }
  }
  async getContestsParticipants(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const contestId = req.params.contestId;

      const participants = await this._getContestParticipantsUseCase.execute(
        contestId,
        userId!,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: participants,
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
        throw new Error(MESSAGES.CONTEST_NOT_FOUND);
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

  async updateContest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const contestId = req.params.contestId;
      const data = req.body;

      const updatedContest = await this._updateContestUseCase.execute(
        contestId,
        data,
      );

      logger.info("Contest updated successfully", { contestId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
        data: updatedContest,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async deleteContest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contestId = req.params.contestId;

      if (!contestId) {
        throw new Error(MESSAGES.CONTEST_NOT_FOUND);
      }

      await this._deleteContestUseCase.delete(contestId);

      logger.info("Contest deleted successfully", { contestId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.DELETE_SUCCESS,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
