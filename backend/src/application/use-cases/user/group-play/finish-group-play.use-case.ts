import { IFinishGroupPlayUseCase } from "../../interfaces/user/group-play/finish-group-play.interface";
import { GroupPlayResult } from "../../../DTOs/user/group-play.dto";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { IResultRepository } from "../../../../domain/interfaces/repository/result-repository.interface";
import { ResultEntity } from "../../../../domain/entities/result.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { updateUserStats } from "../../../services/user-stats.service";
import { IStatsRepository } from "../../../../domain/interfaces/repository/user/stats-repository.interface";
import { StatsEntity } from "../../../../domain/entities/stats.entity";
import { IAchievementService } from "../../../../domain/interfaces/services/acheivment-service.interface";

export class FinishGroupPlayUseCase implements IFinishGroupPlayUseCase {
  constructor(
    private readonly _competitionRepository: ICompetitionRepository,
    private readonly _groupRepository: IGroupRepository,
    private readonly _resultRepository: IResultRepository,
    private readonly _statsRepository: IStatsRepository,
    private readonly _achievementService: IAchievementService
  ) {}

  async execute(gameId: string, resultArray: GroupPlayResult[]): Promise<void> {
    const competitionEntity = await this._competitionRepository.findById(gameId);
    if (!competitionEntity) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPETITION_NOT_FOUND);
    }

    competitionEntity.setStatus("completed");
    await this._competitionRepository.update(competitionEntity.toObject());

    const groupId = competitionEntity.getGroupId();
    if (!groupId) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }

    const groupEntity = await this._groupRepository.findById(groupId);
    if (!groupEntity) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }

    groupEntity.setStatus("completed");
    await this._groupRepository.update(groupEntity.toObject());

    for (const result of resultArray) {
      const resultEntity = new ResultEntity({
        userId: result.userId,
        competitionId: gameId,
        type: "group",
        result: {
          wpm: result.wpm,
          accuracy: Number(result.accuracy),
          errors: result.errors,
          time: result.timeTaken,
          rank: result.rank,
        },
      });

      let stats = await this._statsRepository.findByUserId(result.userId);

      if (!stats) {
        stats = new StatsEntity({
          userId: result.userId,
        });
      }

      const score = await updateUserStats(result.wpm, Number(result.accuracy), groupEntity.getDifficulty(), "group");

      stats.incrementCompetitions();
      stats.updatePerformance(result.wpm, Number(result.accuracy));
      stats.updateScores(score);

      if (stats.getId()) {
        await this._statsRepository.updateStats(result.userId, stats.toObject());
      } else {
        await this._statsRepository.create(stats.toObject());
      }

      await this._resultRepository.create(resultEntity.toObject());

      await this._achievementService.checkAndUnlockAchievements(result.userId);
    }
  }
}
