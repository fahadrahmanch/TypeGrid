import { AuthRequest } from '../../../types/AuthRequest';
import logger from '../../../utils/logger';
import { Response } from 'express';
import { HttpStatus } from '../../constants/httpStatus';
import { IGetCompanyUsersUseCase } from '../../../application/use-cases/interfaces/companyUser/get-company-users.interface';
import { IMakeChallengeUseCase } from '../../../application/use-cases/interfaces/companyUser/make-challenge.interface';
import { IGetSentChallengeUseCase } from '../../../application/use-cases/interfaces/companyUser/get-sent-challenge.interface';
import { MESSAGES } from '../../../domain/constants/messages';
import { IGetChallengesUseCase } from '../../../application/use-cases/interfaces/companyUser/get-challenges.interface';
import { IAcceptChallengeUseCase } from '../../../application/use-cases/interfaces/companyUser/accept-challenge.interface';
import { IGetChallengeGameDataUseCase } from '../../../application/use-cases/interfaces/companyUser/get-challenge-game-data.interface';
import { CustomError } from '../../../domain/entities/custom-error.entity';
import { IRejectChallengeUseCase } from '../../../application/use-cases/interfaces/companyUser/reject-challenge.interface';
export class ChallengesController {
  constructor(
    private _getCompanyUsersUseCase: IGetCompanyUsersUseCase,
    private _makeChallengeUseCase: IMakeChallengeUseCase,
    private _getSentChallengesUseCase: IGetSentChallengeUseCase,
    private _getChallengesUseCase: IGetChallengesUseCase,
    private _acceptChallengeUseCase: IAcceptChallengeUseCase,
    private _getChallengeGameDataUseCase: IGetChallengeGameDataUseCase,
    private _rejectChallengeUseCase: IRejectChallengeUseCase
  ) {}

  //company users
  companyUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { search } = req.query as { search: string };
    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    const users = await this._getCompanyUsersUseCase.execute(userId, search);
    res.status(HttpStatus.OK).json({
      success: true,
      data: users,
    });
  };
  // make challenge
  makeChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
    const receiverId = req.body.receiverId;
    const senderId = req.user?.userId;

    if (!receiverId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    if (!senderId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    await this._makeChallengeUseCase.execute(senderId, receiverId);

    logger.info('Challenge made successfully', { senderId, receiverId });
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: MESSAGES.CREATE_SUCCESS,
    });
  };
  //check already sent challenge
  checkAlreadySentChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
    const senderId = req.user?.userId;

    if (!senderId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.SENDER_ID_REQUIRED);
    }

    const challenges = await this._getSentChallengesUseCase.execute(senderId);

    res.status(HttpStatus.OK).json({
      success: true,
      data: challenges,
    });
  };
  //get all challenges
  getAllChallenges = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const challenges = await this._getChallengesUseCase.execute(userId);

    res.status(HttpStatus.OK).json({
      success: true,
      data: challenges,
    });
  };
  //accept challenge

  acceptChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
    const challengeId = req.params.challengeId;

    if (!challengeId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.CHALLENGE_NOT_FOUND);
    }

    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    await this._acceptChallengeUseCase.execute(challengeId);

    logger.info('Challenge accepted successfully', { challengeId, userId });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
    });
  };

  //get challenge game data
  getChallengeGameData = async (req: AuthRequest, res: Response): Promise<void> => {
    const challengeId = req.params.challengeId;

    if (!challengeId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.CHALLENGE_NOT_FOUND);
    }

    const challengeGameData = await this._getChallengeGameDataUseCase.execute(challengeId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: challengeGameData,
    });
  };
  //reject challenge
  rejectChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
    const challengeId = req.params.challengeId;

    if (!challengeId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.CHALLENGE_NOT_FOUND);
    }

    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    await this._rejectChallengeUseCase.execute(challengeId);

    logger.info('Challenge rejected successfully', { challengeId, userId });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
    });
  };
}
