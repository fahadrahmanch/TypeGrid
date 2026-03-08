import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { IResultRepository } from "../../../../domain/interfaces/repository/company/IResultRepository";
import { ResultEntity } from "../../../../domain/entities/ResultEntity";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { QuicKPlayResult } from "../../../DTOs/user/CompetitionDTOQuickPlay";
export class finishQuickPlayResultUseCase {
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
