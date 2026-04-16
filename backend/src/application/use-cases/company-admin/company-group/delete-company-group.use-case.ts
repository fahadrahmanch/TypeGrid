import { IUserRepository } from '../../../../domain/interfaces/repository/user/user-repository.interface';
import { ICompanyGroupRepository } from '../../../../domain/interfaces/repository/company/company-group-repository.interface';
import { IDeleteCompanyGroupUseCase } from '../../interfaces/companyAdmin/delete-company-group.interface';
import { MESSAGES } from '../../../../domain/constants/messages';

export class DeleteCompanyGroupUseCase implements IDeleteCompanyGroupUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly companyGroupRepository: ICompanyGroupRepository
  ) {}

  async execute(groupId: string, adminUserId: string): Promise<void> {
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

    const deleted = await this.companyGroupRepository.delete(groupId);
    if (!deleted) {
      throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
    }
  }
}
