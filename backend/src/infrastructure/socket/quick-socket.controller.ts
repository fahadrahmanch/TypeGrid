import { IFinishQuickPlayResult } from "../../application/use-cases/interfaces/user/quick-play/finish-quick-play-result.interface";
import logger from "../../utils/logger";
import { IGetJoinMemberUseCase } from "../../application/use-cases/interfaces/user/quick-play/get-quick-play-data.interface";
import { QuicKPlayResult } from "../../application/DTOs/user/competition-quick-play.dto";
import { MESSAGES } from "../../domain/constants/messages";
import { ILeaveQuickPlayUseCase } from "../../application/use-cases/interfaces/user/quick-play/leave-quick-play.interface";
export class QuickSocketController {
  constructor(
    private readonly _getJoinMemberUseCase: IGetJoinMemberUseCase,
    private readonly _finishQuickPlayResultUseCase: IFinishQuickPlayResult,
    private readonly _leaveQuickPlayUseCase: ILeaveQuickPlayUseCase,
  ) {}

  async getQuickPlayData(competitionId: string, userId: string) {
    if (!competitionId || !userId) {
      throw new Error("competitionId or userId missing");
    }
    const member = await this._getJoinMemberUseCase.execute(
      competitionId,
      userId,
    );

    return member;
  }
  async saveQuickPlayResult(
    gameId: string,
    resultArray: QuicKPlayResult[],
  ): Promise<void> {
    try {
      await this._finishQuickPlayResultUseCase.execute(gameId, resultArray);
    } catch (error: any) {
      console.log("error in saveQuickPlayResult socket handler", error);
      logger.error("Error in saveQuickPlayResult socket handler", {
        error: error.message,
        stack: error.stack,
        gameId,
      });
    }
  }

  async leaveQuickPlay(gameId: string, userId: string): Promise<void> {
    try {
      if (!gameId || !userId) {
        throw new Error(MESSAGES.INVALID_REQUEST);
      }
      await this._leaveQuickPlayUseCase.execute(gameId, userId);
    } catch (error: any) {
      logger.error("Error in leaveQuickPlay socket handler", {
        error: error.message,
        stack: error.stack,
        gameId,
      });
    }
  }
}
