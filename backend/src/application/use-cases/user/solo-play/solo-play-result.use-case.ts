import { ISoloPlayResultUseCase } from "../../interfaces/user/solo-play/solo-play-result.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IResultRepository } from "../../../../domain/interfaces/repository/result-repository.interface";
import { ResultEntity } from "../../../../domain/entities/result.entity";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IStatsRepository } from "../../../../domain/interfaces/repository/user/stats-repository.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { StatsEntity } from "../../../../domain/entities/stats.entity";
import { updateUserStats } from "../../../services/user-stats.service";

export class SoloPlayResultUseCase implements ISoloPlayResultUseCase {
  constructor(
    private _competitionRepo: ICompetitionRepository,
    private _userRepo: IUserRepository,
    private _resultRepo: IResultRepository,
    private _statsRepo: IStatsRepository,
    private _lessonRepo: ILessonRepository,
  ) {}

  async execute(userId: string, gameId: string, result: any): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }
    const competition = await this._competitionRepo.findById(gameId);

    if (!competition) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.COMPETITION_NOT_FOUND,
      );
    }
    const competitionEntity = competition as any;
    competitionEntity.endCompetition();
    await this._competitionRepo.update(competitionEntity);

    const lesson = await this._lessonRepo.findById(
      competitionEntity.getTextId()?.toString() ?? "",
    );

    let difficulty: "easy" | "medium" | "hard" = "medium";
    if (lesson) {
      if (lesson.level === "beginner") difficulty = "easy";
      else if (lesson.level === "intermediate") difficulty = "medium";
      else if (lesson.level === "advanced") difficulty = "hard";
    }

    let stats = await this._statsRepo.findByUserId(userId);
    if (!stats) {
      stats = new StatsEntity({
        userId,
      });
    }

    const score = await updateUserStats(
      result.wpm,
      Number(result.accuracy),
      difficulty,
      "solo",
    );

    stats.incrementCompetitions();
    stats.updateScores(score);
    stats.updatePerformance(result.wpm, Number(result.accuracy));

    if (stats.getId()) {
      await this._statsRepo.updateStats(userId, stats.toObject());
    } else {
      await this._statsRepo.create(stats.toObject());
    }

    const resultEntity = new ResultEntity({
      userId,
      competitionId: gameId,
      type: "solo",
      result,
    });
    const resultObject = resultEntity.toObject();
    await this._resultRepo.create(resultObject);
  }
}
