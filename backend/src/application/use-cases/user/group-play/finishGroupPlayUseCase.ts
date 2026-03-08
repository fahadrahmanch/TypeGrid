import { IFinishGroupPlayUseCase } from "../../interfaces/user/groupplayUseCases/IFinishGroupPlayUseCase";
import { GroupPlayResult } from "../../../DTOs/user/groupPlayDTO";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/IGroupRepository";
import { IResultRepository } from "../../../../domain/interfaces/repository/company/IResultRepository";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { ResultEntity } from "../../../../domain/entities/ResultEntity";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";
export class finishGroupPlayUseCase implements IFinishGroupPlayUseCase {
  constructor(
    private competitionRepository: ICompetitionRepository,
    private groupRepository: IGroupRepository,
    private resultRepository: IResultRepository,
  ) {}
  async execute(gameId: string, resultArray: GroupPlayResult[]): Promise<void> {
    const competition = await this.competitionRepository.findById(gameId);
    const competitionEntity = new CompetitionEntity({
      ...(competition as any),
      id: (competition as any)._id,
    });
    competitionEntity.setStatus("completed");
    await this.competitionRepository.update(competitionEntity);
    const groupId = competitionEntity.getGroupId();

    const group = await this.groupRepository.findById(groupId!);
    const groupEntity = new GroupEntity(group as any);
    groupEntity.setStatus("completed");
    const updatedGroup = groupEntity.toObject();
    await this.groupRepository.update(updatedGroup);
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
      const resultObject = resultEntity.toObject();
      await this.resultRepository.create(resultObject);
    }
  }
}
