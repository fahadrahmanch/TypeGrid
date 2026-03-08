import { IGroupRepository } from "../../../../domain/interfaces/repository/user/IGroupRepository";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { IValidateGroupPlayMemberUseCase } from "../../interfaces/user/groupplayUseCases/IValidateGroupPlayMemberUseCase";
export class ValidateGroupPlayMemberUseCase implements IValidateGroupPlayMemberUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private competitionRepository: ICompetitionRepository,
  ) {}

  async execute(gameId: string, userId: string): Promise<boolean> {
    const competition = await this.competitionRepository.findById(gameId);
    const group = await this.groupRepository.findById(
      (competition as any)?.groupId,
    );

    if (!group) {
      return false;
    }

    const isMember = group.members.some(
      (member: any) => member.toString() === userId.toString(),
    );
    return isMember;
  }
}
