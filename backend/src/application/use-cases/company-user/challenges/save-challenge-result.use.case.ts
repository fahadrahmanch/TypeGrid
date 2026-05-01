import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { ISaveChallengeResultUseCase } from "../../interfaces/companyUser/save-challenge-result.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IResultRepository } from "../../../../domain/interfaces/repository/result-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { ResultEntity } from "../../../../domain/entities/result.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { ICompanyUserStatsRepository } from "../../../../domain/interfaces/repository/company/company-user-stats-repository.interface";
import { updateCompanyUserStats } from "../../../services/company-user-stats.service";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
export class SaveChallengeResultUseCase implements ISaveChallengeResultUseCase {
  constructor(
    private readonly _challengeRepository: ICompanyChallengeRepository,
    private readonly _competitionRepository: ICompetitionRepository,
    private readonly _resultRepository: IResultRepository,
    private readonly _statsRepository: ICompanyUserStatsRepository,
    private readonly _lessonRepository: ILessonRepository
  ) {}

  async execute(gameId: string, resultArray: any[]): Promise<void> {
    const challenge = await this._challengeRepository.findById(gameId);
    if (!challenge) {
      throw new CustomError(404, MESSAGES.CHALLENGE_NOT_FOUND);
    }
    const competition = await this._competitionRepository.findById(challenge.getCompetitionId()!);
    const lesson = await this._lessonRepository.findById(competition?.getTextId()!);
    if (!lesson) {
      throw new CustomError(404, MESSAGES.LESSON_NOT_FOUND);
    }
    const difficulty =
      lesson.level == "beginner"
        ? "easy"
        : lesson.level == "intermediate"
          ? "medium"
          : lesson.level == "advanced"
            ? "hard"
            : "medium";
    if (!competition) {
      throw new CustomError(404, MESSAGES.COMPETITION_NOT_FOUND);
    }
    challenge.complete();
    competition.endCompetition();
    for (const res of resultArray) {
      const resultEntity = new ResultEntity({
        userId: res.userId,
        competitionId: gameId,
        type: "oneToOne",
        result: {
          wpm: res.wpm,
          accuracy: Number(res.accuracy),
          errors: res.errors,
          time: res?.timeTaken || 0,
          rank: res.rank,
        },
      });

      await this._challengeRepository.update(challenge.toObject());
      await this._competitionRepository.update(competition.toObject());
      await this._resultRepository.create(resultEntity.toObject());

      if (challenge.getCompanyId()) {
        const score = await updateCompanyUserStats(res.wpm, Number(res.accuracy), difficulty, "oneToOne");

        await this._statsRepository.updateStats(challenge.getCompanyId()!, res.userId, {
          wpm: res.wpm,
          accuracy: Number(res.accuracy),
          totalScore: score,
          weeklyScore: score,
          monthlyScore: score,
        });
      }
    }
  }
}
