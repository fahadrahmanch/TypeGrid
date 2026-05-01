import { IGetCompanyUsersUseCase } from "../interfaces/companyUser/get-company-users.interface";
import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { companyUserDTO } from "../../DTOs/companyUser/company-user.dto";
import { mapCompanyUsersWithOnlineStatus } from "../../mappers/companyUser/company-user.mapper";
import redis from "../../../config/redis";
import { CustomError } from "../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../domain/enums/http-status-codes.enum";

export class GetCompanyUsersUseCase implements IGetCompanyUsersUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}
  async execute(userId: string, search: string): Promise<companyUserDTO[]> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const companyId = user.CompanyId;
    const users = await this._userRepository.getCompanyUsers(search, companyId!);
    const onlineUsers = await redis.smembers("online:users");
    return mapCompanyUsersWithOnlineStatus(users.users, onlineUsers);
  }
}
