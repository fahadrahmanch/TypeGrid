import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { IValidateGroupPlayMemberUseCase } from "../../interfaces/user/groupplayUseCases/IValidateGroupPlayMemberUseCase";
export class ValidateGroupPlayMemberUseCase implements IValidateGroupPlayMemberUseCase {
  constructor(
    private _baseRepoGroup: IBaseRepository<any>,
    private _baseRepoCompetition: IBaseRepository<any>
  ) {}

  async execute(gameId: string, userId: string): Promise<boolean> {
    const competition = await this._baseRepoCompetition.findById(gameId);
    const group= await this._baseRepoGroup.findById(competition?.groupId);
   
    if (!group) {
      return false;
    }

    const isMember = group.members.some(
      (member: any) =>
        member.toString() === userId.toString()
    );
    return isMember;
  }
}
