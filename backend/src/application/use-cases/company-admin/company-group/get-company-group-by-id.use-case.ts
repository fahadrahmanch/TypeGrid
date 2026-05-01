import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { IGetCompanyGroupByIdUseCase } from "../../interfaces/companyAdmin/get-company-group-by-id.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { ICompanyUserStatsRepository } from "../../../../domain/interfaces/repository/company/company-user-stats-repository.interface";
import { CompanyGroupDetailsDTO } from "../../../DTOs/companyAdmin/company-group-details.dto";
import { mapCompanyGroupToDetailsDTO } from "../../../mappers/companyAdmin/company-group.mapper";
import { UserEntity } from "../../../../domain/entities/user.entity";

export class GetCompanyGroupByIdUseCase implements IGetCompanyGroupByIdUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly companyGroupRepository: ICompanyGroupRepository,
    private readonly userStatusRepository: ICompanyUserStatsRepository
  ) {}

  async execute(groupId: string, userId: string): Promise<CompanyGroupDetailsDTO | null> {
    if (!userId) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    const adminUser = await this.userRepository.findById(userId);
    if (!adminUser) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    if (!adminUser.CompanyId) {
      throw new Error(MESSAGES.USER_NOT_PART_OF_ANY_COMPANY);
    }

    const group = await this.companyGroupRepository.findById(groupId);
    if (!group) {
      throw new Error(MESSAGES.GROUP_NOT_FOUND || "Group not found");
    }

    // Ensure the group belongs to the same company
    if (group.getCompanyId().toString() !== adminUser.CompanyId.toString()) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    const memberIds = group.getMembers();
    const populatedMembers: (UserEntity & { wpm: number; accuracy: number })[] = [];

    for (const memberId of memberIds) {
      const user = await this.userRepository.findById(memberId);
      const status = await this.userStatusRepository.findOne({
        userId: memberId,
      });

      if (user) {
        populatedMembers.push({
          ...user,
          wpm: status?.getWpm() || 0,
          accuracy: status?.getAccuracy() || 0,
        });
      }
    }

    return mapCompanyGroupToDetailsDTO(group, populatedMembers);
  }
}
