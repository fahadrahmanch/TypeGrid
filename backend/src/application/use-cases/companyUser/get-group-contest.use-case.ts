import { IGetGroupContestsUseCase } from "../interfaces/companyUser/get-group-contest.interface";
import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyGroupRepository } from "../../../domain/interfaces/repository/company/company-group-repository.interface";
import { IContestRepository } from "../../../domain/interfaces/repository/company/contest-repository.interface";
import { groupContestDTO } from "../../DTOs/companyAdmin/company-contest.dto";
import { mapGroupContestDTO } from "../../mappers/companyAdmin/company-contest.mapper";
export class GetGroupContestUseCase implements IGetGroupContestsUseCase {
  constructor(
    private readonly contestRepository: IContestRepository,
    private readonly userRepository: IUserRepository,
    private readonly _companyGroupRepository: ICompanyGroupRepository,
    private readonly _contestRepository: IContestRepository,
  ) {}
  async execute(userId: string): Promise<groupContestDTO[] | null> {
    const groups = await this._companyGroupRepository.getGroup(userId);
    const groupsId = groups?.map((obj) => (obj as any)._id.toString());
    if (!groupsId?.length) return [];
    const groupContests =
      await this._contestRepository.getGroupContests(groupsId);
    if (!groupContests.length) return [];
    return mapGroupContestDTO(groupContests, userId);
  }
}
