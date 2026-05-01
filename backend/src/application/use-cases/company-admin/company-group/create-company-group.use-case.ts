import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { CompanyGroupEntity } from "../../../../domain/entities/company-group.entity";
import { ICreateCompanyGroupUseCase } from "../../interfaces/companyAdmin/create-company-group.interface";
import { CompanyGroupDTO } from "../../../DTOs/companyAdmin/company-group.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
export class CreateCompanyGroupUseCase implements ICreateCompanyGroupUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly companyGroupRepo: ICompanyGroupRepository
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
