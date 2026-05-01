import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { UserEntity } from "../../../../domain/entities";
import { IGetCompanyUsersUseCase } from "../../interfaces/companyAdmin/get-company-users.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";

/**
 * Use case for retrieving all users belonging to a company.
 */
export class GetCompanyUsersUseCase implements IGetCompanyUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Fetch company users by company ID.
   * @param CompanyId - Company identifier
   * @returns List of company users
   */
  async execute(CompanyId: string, search: string, page: number, limit: number): Promise<{ users: UserEntity[]; total: number }> {
    if (!CompanyId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    return await this.userRepository.getCompanyUsers(search, CompanyId, page, limit);
  }
}
