import { IGetCompanyLeaderboardUseCase } from "../../interfaces/companyUser/get-company-leaderboard.interface";
import { ICompanyUserStatsRepository } from "../../../../domain/interfaces/repository/company/company-user-stats-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { CompanyLeaderboardDTO } from "../../../DTOs/companyUser/company-leaderboard.dto";
import { CompanyLeaderboardMapper } from "../../../mappers/companyUser/company-leaderboard.mapper";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";

export class GetCompanyLeaderboardUseCase implements IGetCompanyLeaderboardUseCase {
  constructor(
    private readonly _statsRepository: ICompanyUserStatsRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    limit: number,
  ): Promise<CompanyLeaderboardDTO[]> {
    if (!userId) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.INVALID_REQUEST,
      );
    }

    const user = await this._userRepository.findById(userId);
    if (!user || !user.CompanyId) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }

    const stats = await this._statsRepository.getLeaderboard(
      user.CompanyId,
      limit,
    );

    const leaderboard: CompanyLeaderboardDTO[] = await Promise.all(
      stats.map(async (stat) => {
        const user = await this._userRepository.findById(stat.getUserId());
        return CompanyLeaderboardMapper.toDTO(
          stat,
          user?.name || "Unknown",
          user?.imageUrl || "",
        );
      }),
    );

    return leaderboard;
  }
}
