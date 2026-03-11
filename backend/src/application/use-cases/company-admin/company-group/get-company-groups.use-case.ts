import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { IGetCompanyGroupsUseCase } from "../../interfaces/companyAdmin/get-company-groups.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CompanyGroupDTO } from "../../../DTOs/companyAdmin/company-group.dto";
export class GetCompanyGroupsUseCase implements IGetCompanyGroupsUseCase {
  constructor(
    private readonly baseUserRepo: IUserRepository,
    private readonly baseCompanyGroupRepo: ICompanyGroupRepository,
  ) {}

  async execute(userId: string): Promise<CompanyGroupDTO[]> {
    if (!userId) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const user = await this.baseUserRepo.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }

    if (!user.CompanyId) {
      throw new Error(MESSAGES.USER_NOT_PART_OF_ANY_COMPANY);
    }

    const groups = await this.baseCompanyGroupRepo.find({
      companyId: user.CompanyId,
    });
    return groups as any;
  }
}
