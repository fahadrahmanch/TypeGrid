import { IFinishGroupPlayUseCase } from "../../interfaces/user/group-play/finish-group-play.interface";
import { GroupPlayResult } from "../../../DTOs/user/group-play.dto";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { IResultRepository } from "../../../../domain/interfaces/repository/company/result-repository.interface";
import { CompetitionEntity } from "../../../../domain/entities/competition.entity";
import { ResultEntity } from "../../../../domain/entities/result.entity";
import { GroupEntity } from "../../../../domain/entities/group.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";

export class FinishGroupPlayUseCase implements IFinishGroupPlayUseCase {
  constructor(
    private competitionRepository: ICompetitionRepository,
    private groupRepository: IGroupRepository,
    private resultRepository: IResultRepository,
  ) {}
  async execute(gameId: string, resultArray: GroupPlayResult[]): Promise<void> {
    const competition = await this.competitionRepository.findById(gameId);
    if (!competition) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        "Competition not found",
      );
    }
    const competitionEntity = new CompetitionEntity({
      ...(competition as any),
      id: (competition as any)._id,
    });
    competitionEntity.setStatus("completed");
    await this.competitionRepository.update(competitionEntity);
    const groupId = competitionEntity.getGroupId();

    if (!groupId) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }

    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }
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
