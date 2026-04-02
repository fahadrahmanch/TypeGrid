import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IResultRepository } from "../../../../domain/interfaces/repository/result-repository.interface";
import { ResultEntity } from "../../../../domain/entities/result.entity";
import { CompetitionEntity } from "../../../../domain/entities/competition.entity";
import { QuicKPlayResult } from "../../../DTOs/user/competition-quick-play.dto";
export class FinishQuickPlayUseCase {
  constructor(
    private competitionRepository: ICompetitionRepository,
    private resultRepository: IResultRepository,
  ) {}
  async execute(gameId: string, resultArray: QuicKPlayResult[]): Promise<void> {
    const competition = await this.competitionRepository.findById(gameId);
    const competitionEntity = new CompetitionEntity({
      ...(competition as any),
      id: (competition as any)._id,
    });
    competitionEntity.setStatus("completed");
    await this.competitionRepository.update(competitionEntity);

    for (const result of resultArray) {
      const resultEntity = new ResultEntity({
        userId: result.userId,
        competitionId: gameId,
        type: "quick",
        result: {
          wpm: result.wpm,
          accuracy: Number(result.accuracy),
          errors: result.errors,
          time: result.timeTaken,
          rank: result.rank,
        },
      });
      const resultObject = resultEntity.toObject();
      await this.resultRepository.create(resultObject);
    }
  }
}
