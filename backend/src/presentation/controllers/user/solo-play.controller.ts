import { Response, NextFunction } from "express";
import logger from "../../../utils/logger";
import { AuthRequest } from "../../../types/AuthRequest";
import { HttpStatus } from "../../constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { ICreateSoloPlayUseCase } from "../../../application/use-cases/interfaces/user/solo-play/create-solo-play.interface";
import { ISoloPlayResultUseCase } from "../../../application/use-cases/interfaces/user/solo-play/solo-play-result.interface";
export class SoloPlayController {
  constructor(
    private _createSoloPlayUseCase: ICreateSoloPlayUseCase,
    private _soloPlayResultUseCase: ISoloPlayResultUseCase,
  ) {}

  async createSoloPlay(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      const soloPlay = await this._createSoloPlayUseCase.execute(userId);

      logger.info("Solo play created successfully", {
        userId,
        soloPlayId: soloPlay._id,
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Solo play created successfully",
        data: soloPlay,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async result(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const gameId = req.params.gameId;
      const result = req.body;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      if (!gameId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.GAME_ID_NOT_FOUND,
        });
        return;
      }
      await this._soloPlayResultUseCase.execute(userId, gameId, result);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Solo play result saved successfully",
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
