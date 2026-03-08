import { IGetCompanyUsersUseCase } from "../interfaces/companyUser/get-company-users.interface";
import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import {
  companyUserDTO,
  mapCompanyUsersWithOnlineStatus,
} from "../../DTOs/companyUser/company-user.dto";
import redis from "../../../config/redis";

export class GetCompanyUsersUseCase implements IGetCompanyUsersUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(userId: string): Promise<companyUserDTO[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const companyId = user.CompanyId;
    const users = await this.userRepository.find({
      CompanyId: companyId,
    });
    const onlineUsers = await redis.smembers("online:users");
    return mapCompanyUsersWithOnlineStatus(users as any, onlineUsers);
  }
}
