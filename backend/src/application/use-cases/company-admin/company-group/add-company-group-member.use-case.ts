import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { IAddCompanyGroupMemberUseCase } from "../../interfaces/companyAdmin/add-company-group-member.interface";
import { MESSAGES } from "../../../../domain/constants/messages";

export class AddCompanyGroupMemberUseCase implements IAddCompanyGroupMemberUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly companyGroupRepository: ICompanyGroupRepository,
  ) {}

  async execute(groupId: string, memberId: string, adminUserId: string): Promise<void> {
    const adminUser = await this.userRepository.findById(adminUserId);
    if (!adminUser || !adminUser.CompanyId) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    const group = await this.companyGroupRepository.findById(groupId);
    if (!group) {
      throw new Error(MESSAGES.GROUP_NOT_FOUND);
    }

    if (group.getCompanyId().toString() !== adminUser.CompanyId.toString()) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    const memberUser = await this.userRepository.findById(memberId);
    if (!memberUser) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }

    group.addMember(memberId);

    const updated = await this.companyGroupRepository.updateById(groupId, {
      members: group.getMembers(),
    });

    if (!updated) {
      throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
    }
  }
}
