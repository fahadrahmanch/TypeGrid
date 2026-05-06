import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IGetCompanyUsersUseCase } from "../../interfaces/companyAdmin/get-company-users.interface";
import { ICompanyUserStatsRepository } from "../../../../domain/interfaces/repository/company/company-user-stats-repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapCompanyUserToDTO } from "../../../mappers/companyAdmin/company-user.mapper";
import { CompanyUserManagementDTO } from "../../../DTOs/companyAdmin/company-user-management.dto";

/**
 * Use case for retrieving all users belonging to a company.
 */
export class GetCompanyUsersUseCase implements IGetCompanyUsersUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly companyUserStatsRepository: ICompanyUserStatsRepository
  ) {}

  /**
   * Fetch company users by company ID.
   * @param CompanyId - Company identifier
   * @returns List of company users
   */
  async execute(
    CompanyId: string,
    search: string,
    page: number,
    limit: number
  ): Promise<{ users: CompanyUserManagementDTO[]; total: number }> {
    if (!CompanyId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    const data = await this.userRepository.getCompanyUsers(search, CompanyId, page, limit);

    const userIds = data.users.map((u) => u._id?.toString()).filter((id) => !!id) as string[];
    const stats = await this.companyUserStatsRepository.findByUserIds(userIds);

    const users = data.users.map((user) => {
      const userStat = stats.find((s) => s.getUserId().toString() === user._id?.toString());
      return mapCompanyUserToDTO(user, userStat);
    });

    return { users, total: data.total };
  }
}
