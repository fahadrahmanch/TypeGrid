import { Response } from 'express';
import logger from '../../../utils/logger';
import { HttpStatus } from '../../constants/httpStatus';
import { ICreateCompanyContestUseCase } from '../../../application/use-cases/interfaces/companyAdmin/create-company-contest.interface';
import { AuthRequest } from '../../../types/AuthRequest';
import { IGetCompanyContestsUsecase } from '../../../application/use-cases/interfaces/companyAdmin/get-company-contests.interface';
import { IUpdateCompanyContestStatusUseCase } from '../../../application/use-cases/interfaces/companyAdmin/update-company-contest-status.interface';
import { IGetContestParticipantsUseCase } from '../../../application/use-cases/interfaces/companyAdmin/get-contest-participants.interface';
import { IGetContestUseCase } from '../../../application/use-cases/interfaces/companyAdmin/get-contest.interface';
import { MESSAGES } from '../../../domain/constants/messages';
import { IUpdateContestUseCase } from '../../../application/use-cases/interfaces/companyAdmin/update-contest.interface';
import { IDeleteContestUseCase } from '../../../application/use-cases/interfaces/companyAdmin/delete-contest.interface';
import { IGetContestResultUseCase } from '../../../application/use-cases/interfaces/companyUser/get-contest-result.interface';
import { CustomError } from '../../../domain/entities/custom-error.entity';
export class CompanyContestManagementController {
  constructor(
    private _createCompanyContestUseCase: ICreateCompanyContestUseCase,
    private _getCompanyContestsUseCase: IGetCompanyContestsUsecase,
    private _updateCompanyContestStatusUseCase: IUpdateCompanyContestStatusUseCase,
    private _getContestParticipantsUseCase: IGetContestParticipantsUseCase,
    private _getContestUseCase: IGetContestUseCase,
    private _updateContestUseCase: IUpdateContestUseCase,
    private _deleteContestUseCase: IDeleteContestUseCase,
    private _getContestResultUseCase: IGetContestResultUseCase
  ) {}

  //create contest

  createContest = async (req: AuthRequest, res: Response): Promise<void> => {
    const data = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contest = await this._createCompanyContestUseCase.execute(data, userId);
    logger.info('Company contest created successfully', { userId });

    res.status(HttpStatus.OK).json({
      data: contest,
      success: true,
      message: MESSAGES.CREATE_SUCCESS,
    });
  };

  // get contests

  getContests = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contests = await this._getCompanyContestsUseCase.execute(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.FETCH_SUCCESS,
      data: contests,
    });
  };

  //update contest status
  updateContestStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    const contestId = req.params.contestId;
    const status = req.body.status;

    if (!contestId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.SOMETHING_WENT_WRONG);
    }

    await this._updateCompanyContestStatusUseCase.execute(contestId, status);
    logger.info('Contest status updated successfully', { contestId, status });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
      status: status,
    });
  };

  // get contests participants

  getContestsParticipants = async (req: AuthRequest, res: Response): Promise<void> => {
    const contestId = req.params.contestId;
    if (!contestId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.SOMETHING_WENT_WRONG);
    }

    const participants = await this._getContestParticipantsUseCase.execute(contestId);

    res.status(HttpStatus.OK).json({
      success: true,
      data: participants,
    });
  };

  //get contest data
  getContestData = async (req: AuthRequest, res: Response): Promise<void> => {
    const contestId = req.params.contestId;
    const userId = req.user?.userId;
    if (!contestId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contest = await this._getContestUseCase.execute(contestId, userId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: contest,
    });
  };

  // update contest
  updateContest = async (req: AuthRequest, res: Response): Promise<void> => {
    const contestId = req.params.contestId;
    const data = req.body;

    if (!contestId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.SOMETHING_WENT_WRONG);
    }

    const updatedContest = await this._updateContestUseCase.execute(contestId, data);

    logger.info('Contest updated successfully', { contestId });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
      data: updatedContest,
    });
  };

  // delete contest
  deleteContest = async (req: AuthRequest, res: Response): Promise<void> => {
    const contestId = req.params.contestId;

    if (!contestId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }

    await this._deleteContestUseCase.execute(contestId);

    logger.info('Contest deleted successfully', { contestId });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.DELETE_SUCCESS,
    });
  };

  getContestResult = async (req: AuthRequest, res: Response): Promise<void> => {
    const contestId = req.params.contestId;
    if (!contestId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }
    const result = await this._getContestResultUseCase.execute(contestId);
    logger.info('Contest result fetched successfully', { contestId });
    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  };
}
