import { IStartChallengeUseCase } from "../../application/use-cases/interfaces/companyUser/start-challenge.interface";
import { CustomError } from "../../domain/entities/custom-error.entity";
import logger from "../../utils/logger";
import { ISaveChallengeResultUseCase } from "../../application/use-cases/interfaces/companyUser/save-challenge-result.interface";

export class ChallengeSocketController {
  constructor(
    private readonly _startChallengeUseCase: IStartChallengeUseCase,
    private readonly _saveChallengeResultUseCase: ISaveChallengeResultUseCase
  ) {}

  async execute(challengeId: string): Promise<void> {
    if (!challengeId) {
      logger.warn("ChallengeSocketController: missing challengeId");
      return;
    }

    try {
      await this._startChallengeUseCase.execute(challengeId);
      logger.info("Challenge started successfully", { challengeId });
    } catch (err) {
      if (err instanceof CustomError) {
        logger.error("Challenge start failed", {
          challengeId,
          message: err.message,
        });
        return;
      }
      logger.error("Unexpected error in ChallengeSocketController", {
        challengeId,
        err,
      });
    }
  }

  async saveChallengePlayResult(gameId: string, resultArray: any[]): Promise<void> {
    try {
      await this._saveChallengeResultUseCase.execute(gameId, resultArray);
      logger.info("Challenge play result saved successfully", { gameId });
    } catch (err) {
      if (err instanceof CustomError) {
        logger.error("Challenge play result save failed", {
          gameId,
          message: err.message,
        });
        return;
      }
      logger.error("Unexpected error in ChallengeSocketController", {
        gameId,
        err,
      });
    }
  }
}
