import { IGetGroupContestsUseCase } from "../interfaces/companyUser/IGetGroupContestUseCase";
import { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";
import { ICompanyGroupRepository } from "../../../domain/interfaces/repository/company/ICompanyGroupRepository";
import { IContestRepository } from "../../../domain/interfaces/repository/company/IContestRepository";
import { groupContestDTO } from "../../DTOs/companyAdmin/CompanyContestDTO";
import { mapGroupContestDTO } from "../../DTOs/companyAdmin/CompanyContestDTO";
export class getGroupConstestsUsecase implements IGetGroupContestsUseCase {
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
    return mapGroupContestDTO(groupContests as any, userId);
  }
}
