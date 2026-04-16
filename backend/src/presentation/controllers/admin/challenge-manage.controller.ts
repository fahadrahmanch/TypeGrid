import { Request, Response } from 'express';
import { ICreateChallengeUseCase } from '../../../application/use-cases/interfaces/admin/create-challenge.interface';
import { IGetChallengeUseCase } from '../../../application/use-cases/interfaces/admin/get-challenge.interface';
import { IGetChallengesUseCase } from '../../../application/use-cases/interfaces/admin/get-challenges.interface';
import { IUpdateChallengeUseCase } from '../../../application/use-cases/interfaces/admin/update-challenge.interface';
import { IDeleteChallengeUseCase } from '../../../application/use-cases/interfaces/admin/delete-challenge.interface';
import logger from '../../../utils/logger';
import { HttpStatus } from '../../constants/httpStatus';
import { MESSAGES } from '../../../domain/constants/messages';

export class ChallengeManageController {
  constructor(
    private readonly _createChallengeUseCase: ICreateChallengeUseCase,
    private readonly _getChallengeUseCase: IGetChallengeUseCase,
    private readonly _updateChallengeUseCase: IUpdateChallengeUseCase,
    private readonly _deleteChallengeUseCase: IDeleteChallengeUseCase,
    private readonly _getChallengesUseCase: IGetChallengesUseCase
  ) {}

  createChallenge = async (req: Request, res: Response): Promise<void> => {
    const challenge = await this._createChallengeUseCase.execute(req.body);
    logger.info(MESSAGES.CHALLENGE_CREATED_SUCCESS, challenge);
    res.status(HttpStatus.CREATED).json({
      message: MESSAGES.CHALLENGE_CREATED_SUCCESS,
      challenge,
    });
  };

  getChallenges = async (req: Request, res: Response): Promise<void> => {
    const { search, page, limit } = req.query;
    const result = await this._getChallengesUseCase.execute(search as string, Number(page), Number(limit));
    logger.info(MESSAGES.CHALLENGES_FETCHED_SUCCESS, result);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.CHALLENGES_FETCHED_SUCCESS,
      challenges: result.challenges,
      total: result.total,
    });
  };

  getChallengeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const challenge = await this._getChallengeUseCase.execute(id as string);
    logger.info(MESSAGES.CHALLENGE_FETCHED_SUCCESS, challenge);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.CHALLENGE_FETCHED_SUCCESS,
      challenge,
    });
  };

  updateChallenge = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const challenge = await this._updateChallengeUseCase.execute(id as string, req.body);
    logger.info(MESSAGES.CHALLENGE_UPDATED_SUCCESS, challenge);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.CHALLENGE_UPDATED_SUCCESS,
      challenge,
    });
  };

  deleteChallenge = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this._deleteChallengeUseCase.execute(id as string);
    logger.info(MESSAGES.CHALLENGE_DELETED_SUCCESS, { id });
    res.status(HttpStatus.OK).json({
      message: MESSAGES.CHALLENGE_DELETED_SUCCESS,
    });
  };
}
