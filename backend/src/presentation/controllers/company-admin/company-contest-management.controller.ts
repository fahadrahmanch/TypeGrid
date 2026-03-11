import { Response, NextFunction } from "express";
import logger from "../../../utils/logger";
import { HttpStatus } from "../../constants/httpStatus";
import { ICreateCompanyContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/create-company-contest.interface";
import { AuthRequest } from "../../../types/AuthRequest";
import { IGetCompanyContestsUsecase } from "../../../application/use-cases/interfaces/companyAdmin/get-company-contests.interface";
import { IUpdateCompanyContestStatusUseCase } from "../../../application/use-cases/interfaces/companyAdmin/update-company-contest-status.interface";
import { IGetContestParticipantsUseCase } from "../../../application/use-cases/interfaces/companyAdmin/get-contest-participants.interface";
import { IGetContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/get-contest.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { IUpdateContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/update-contest.interface";
import { IDeleteContestUseCase } from "../../../application/use-cases/interfaces/companyAdmin/delete-contest.interface";
import { CustomError } from "../../../domain/entities/custom-error.entity";

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

  //create contest

  async createContest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
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

  // get contests

  async getContests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      const contests = await this._getCompanyContestsUseCase.execute(userId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.FETCH_SUCCESS,
        data: contests,
      });
    } catch (error: any) {
      next(error);
    }
  }

  //update contest status
  async updateContestStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const contestId = req.params.contestId;
      const status = req.body.status;

      if (!contestId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }

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

  // get contests participants

  async getContestsParticipants(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const contestId = req.params.contestId;
      if (!contestId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }

      const participants = await this._getContestParticipantsUseCase.execute(
        contestId,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: participants,
      });
    } catch (error: any) {
      next(error);
    }
  }

  //get contest data
  async getContestData(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const contestId = req.params.contestId;
      const userId = req.user?.userId;
      if (!contestId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.CONTEST_NOT_FOUND,
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
    } catch (error: any) {
      next(error);
    }
  }

  // update contest
  async updateContest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const contestId = req.params.contestId;
      const data = req.body;

      if (!contestId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }

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

  // delete contest
  async deleteContest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const contestId = req.params.contestId;

      if (!contestId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.CONTEST_NOT_FOUND,
        });
        return;
      }

      await this._deleteContestUseCase.execute(contestId);

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
