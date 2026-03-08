import { AuthRequest } from "../../../types/AuthRequest";
import logger from "../../../utils/logger";
import { Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetCompanyUsers } from "../../../application/use-cases/interfaces/companyUser/IGetCompanyUsers";
import { IMakeChallengeUseCase } from "../../../application/use-cases/interfaces/companyUser/IMakeChallengeUseCase";
import { IGetSentChallengeUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetSentChallengeUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetChallengesUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetChallengesUseCase";
import { getIO } from "../../../infrastructure/socket/socket";
import { IAcceptChallengeUseCase } from "../../../application/use-cases/interfaces/companyUser/IAcceptChallengeUseCase";
import { IGetChallengeGameDataUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetChallengeGameDataUseCase";
export class challengesController {
  constructor(
    private _getCompanyUsersUseCase: IGetCompanyUsers,
    private _makeChallengeUseCase: IMakeChallengeUseCase,
    private _getSentChallengesUseCase: IGetSentChallengeUseCase,
    private _getChallengesUseCase: IGetChallengesUseCase,
    private _acceptChallengeUseCase: IAcceptChallengeUseCase,
    private _getChallengeGameDataUseCase: IGetChallengeGameDataUseCase,
  ) {}
  async companyUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new Error(MESSAGES.UNAUTHORIZED);
      }

      const users = await this._getCompanyUsersUseCase.execute(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      next(error);
    }
  }
  async makeChallenge(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const receiverId = req.body.receiverId;
      const senderId = req.user?.userId;

      if (!receiverId) {
        throw new Error(MESSAGES.INVALID_REQUEST);
      }

      if (!senderId) {
        throw new Error(MESSAGES.UNAUTHORIZED);
      }

      const challenge = await this._makeChallengeUseCase.execute(
        senderId,
        receiverId,
      );
      const io = getIO();

      io.to(`user:${receiverId}`).emit("challenge-received", challenge);

      logger.info("Challenge made successfully", { senderId, receiverId });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGES.CREATE_SUCCESS,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async checkAlreadySentChallenge(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const senderId = req.user?.userId;

      if (!senderId) {
        throw new Error(MESSAGES.SENDER_ID_REQUIRED);
      }

      const challenges = await this._getSentChallengesUseCase.execute(senderId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: challenges,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAllChallenges(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }

      const challenges = await this._getChallengesUseCase.execute(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: challenges,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async acceptChallenge(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const challengeId = req.params.challengeId;

      if (!challengeId) {
        throw new Error(MESSAGES.CHALLENGE_NOT_FOUND);
      }

      const userId = req.user?.userId;

      if (!userId) {
        throw new Error(MESSAGES.UNAUTHORIZED);
      }

      await this._acceptChallengeUseCase.execute(challengeId);

      logger.info("Challenge accepted successfully", { challengeId, userId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getChallengeGameData(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const challengeId = req.params.challengeId;

      if (!challengeId) {
        throw new Error(MESSAGES.CHALLENGE_NOT_FOUND);
      }

      const challengeGameData =
        await this._getChallengeGameDataUseCase.execute(challengeId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: challengeGameData,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
