import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/ICompanyGroupRepository";
import { CompanyGroupEntity } from "../../../../domain/entities/CompanyGroupEntity";
import { ICreateCompanyGroupUseCase } from "../../interfaces/companyAdmin/ICreateCompanyGroupUseCase";
import { CompanyGroupDTO } from "../../../DTOs/companyAdmin/companyGroupDTO";
import { MESSAGES } from "../../../../domain/constants/messages";
export class createCompanyGroupUseCase implements ICreateCompanyGroupUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly companyGroupRepo: ICompanyGroupRepository,
  ) {}

  async execute(groupData: CompanyGroupDTO, userId: string): Promise<void> {
    if (!userId) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }

    if (!groupData) {
      throw new Error(MESSAGES.GROUP_DATA_REQUIRED);
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }

    if (!user.CompanyId) {
      throw new Error(MESSAGES.USER_NOT_PART_OF_ANY_COMPANY);
    }

    const companyGroup = new CompanyGroupEntity({
      companyId: user.CompanyId,
      name: groupData.groupName,
      type: groupData.groupType,
      members: groupData.selectedUsers,
    });

    await this.companyGroupRepo.create(companyGroup);
  }
}
