import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyUserStatsRepository } from "../../../../domain/interfaces/repository/company/company-user-stats-repository.interface";
import { IGetCompanyUsersWithStatusUseCase } from "../../interfaces/companyAdmin/get-company-users-with-status.interface";
import { CompanyGroupMemberDTO } from "../../../DTOs/companyAdmin/company-group-details.dto";
import { MESSAGES } from "../../../../domain/constants/messages";

export class GetCompanyUsersWithStatusUseCase implements IGetCompanyUsersWithStatusUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly companyUserStatsRepository: ICompanyUserStatsRepository,
  ) {}

  async execute(CompanyId: string): Promise<CompanyGroupMemberDTO[]> {
    if (!CompanyId) {
      throw new Error(MESSAGES.INVALID_REQUEST);
    }

    const companyUsers = await this.userRepository.find({
      CompanyId,
      role: "companyUser",
    });

    const usersWithStatus: CompanyGroupMemberDTO[] = [];

    for (const user of companyUsers) {
      const stats = await this.companyUserStatsRepository.findOne({ userId: user._id });
      
      usersWithStatus.push({
        _id: user._id || "",
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        CompanyId: user.CompanyId,
        wpm: stats?.getWpm() || 0,
        accuracy: stats?.getAccuracy() || 0,
      });
    }

    return usersWithStatus;
  }
}
