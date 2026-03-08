import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/ICompanyGroupRepository";
import { IGetCompanyGroupsUseCase } from "../../interfaces/companyAdmin/IGetCompanyGroupsUseCase";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CompanyGroupDTO } from "../../../DTOs/companyAdmin/companyGroupDTO";
export class getCompanyGroupsUseCase implements IGetCompanyGroupsUseCase {
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
