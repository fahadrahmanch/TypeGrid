import { IGetCompanyUsers } from "../interfaces/companyUser/IGetCompanyUsers";
import { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";
import { MESSAGES } from "../../../domain/constants/messages";
import {
  companyUserDTO,
  mapCompanyUsersWithOnlineStatus,
} from "../../DTOs/companyUser/companyUserDto";
import redis from "../../../config/redis";

export class getCompanyUsers implements IGetCompanyUsers {
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
