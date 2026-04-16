import { IUserRepository } from '../../../../domain/interfaces/repository/user/user-repository.interface';
import { ICompanyGroupRepository } from '../../../../domain/interfaces/repository/company/company-group-repository.interface';
import { IRemoveCompanyGroupMemberUseCase } from '../../interfaces/companyAdmin/remove-company-group-member.interface';
import { MESSAGES } from '../../../../domain/constants/messages';

export class RemoveCompanyGroupMemberUseCase implements IRemoveCompanyGroupMemberUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly companyGroupRepository: ICompanyGroupRepository
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

    group.removeMember(memberId);

    const updated = await this.companyGroupRepository.updateById(groupId, {
      members: group.getMembers(),
    });

    if (!updated) {
      throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
    }
  }
}
