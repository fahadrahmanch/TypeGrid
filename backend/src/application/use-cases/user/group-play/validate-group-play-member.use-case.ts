import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IValidateGroupPlayMemberUseCase } from "../../interfaces/user/group-play/validate-group-play-member.interface";
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

    const isMember = group
      .getMembers()
      .some((member: any) => member.toString() === userId.toString());
    return isMember;
  }
}
