import { AuthRequest } from "../../../types/AuthRequest";
import logger from "../../../utils/logger";
import { Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetCompanyUsersUseCase } from "../../../application/use-cases/interfaces/companyUser/get-company-users.interface";
import { IMakeChallengeUseCase } from "../../../application/use-cases/interfaces/companyUser/make-challenge.interface";
import { IGetSentChallengeUseCase } from "../../../application/use-cases/interfaces/companyUser/get-sent-challenge.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetChallengesUseCase } from "../../../application/use-cases/interfaces/companyUser/get-challenges.interface";
import { IAcceptChallengeUseCase } from "../../../application/use-cases/interfaces/companyUser/accept-challenge.interface";
import { IGetChallengeGameDataUseCase } from "../../../application/use-cases/interfaces/companyUser/get-challenge-game-data.interface";
import { CustomError } from "../../../domain/entities/custom-error.entity";
import { IRejectChallengeUseCase } from "../../../application/use-cases/interfaces/companyUser/reject-challenge.interface";
export class ChallengesController {
  constructor(
    private _getCompanyUsersUseCase: IGetCompanyUsersUseCase,
    private _makeChallengeUseCase: IMakeChallengeUseCase,
    private _getSentChallengesUseCase: IGetSentChallengeUseCase,
    private _getChallengesUseCase: IGetChallengesUseCase,
    private _acceptChallengeUseCase: IAcceptChallengeUseCase,
    private _getChallengeGameDataUseCase: IGetChallengeGameDataUseCase,
    private _rejectChallengeUseCase: IRejectChallengeUseCase,
  ) {}

  //company users
  async companyUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const {search}=req.query as {search:string}
      console.log("search",search)
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const users = await this._getCompanyUsersUseCase.execute(userId,search);
      res.status(HttpStatus.OK).json({
        success: true,
        data: users,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  // make challenge
  async makeChallenge(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const receiverId = req.body.receiverId;
      const senderId = req.user?.userId;

      if (!receiverId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INVALID_REQUEST,
        });
        return;
      }

      if (!senderId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      await this._makeChallengeUseCase.execute(
        senderId,
        receiverId,
      );
  


      logger.info("Challenge made successfully", { senderId, receiverId });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGES.CREATE_SUCCESS,
      });
    } catch (err: any) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      } else {
        next(err);
      }
    }
  }
//check already sent challenge
  async checkAlreadySentChallenge(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const senderId = req.user?.userId;

      if (!senderId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.SENDER_ID_REQUIRED,
        });
        return;
      }

      const challenges = await this._getSentChallengesUseCase.execute(senderId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: challenges,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
//get all challenges
  async getAllChallenges(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }

      const challenges = await this._getChallengesUseCase.execute(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: challenges,
      });
    } catch (error: unknown) {
      
        next(error);
      
    }
  }
  //accept challenge

  async acceptChallenge(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const challengeId = req.params.challengeId;

      if (!challengeId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.CHALLENGE_NOT_FOUND,
        });
        return;
      }

      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      await this._acceptChallengeUseCase.execute(challengeId);

      logger.info("Challenge accepted successfully", { challengeId, userId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error: unknown) {
    
        next(error);
      
    }
  }

  //get challenge game data
  async getChallengeGameData(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const challengeId = req.params.challengeId;

      if (!challengeId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.CHALLENGE_NOT_FOUND,
        });
        return;
      }

      const challengeGameData =
        await this._getChallengeGameDataUseCase.execute(challengeId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: challengeGameData,
      });
    } catch (error: unknown) {
     
        next(error);
      
    }
  }
  //reject challenge
  async rejectChallenge(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const challengeId = req.params.challengeId;
      console.log("challengeID",challengeId)

      if (!challengeId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.CHALLENGE_NOT_FOUND,
        });
        return;
      }

      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      await this._rejectChallengeUseCase.execute(challengeId);

      logger.info("Challenge rejected successfully", { challengeId, userId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error: unknown) {
    
        next(error);
      
    }
  }
}
