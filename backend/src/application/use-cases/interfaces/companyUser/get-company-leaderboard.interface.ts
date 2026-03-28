import { CompanyLeaderboardDTO } from "../../../DTOs/companyUser/company-leaderboard.dto";

export interface IGetCompanyLeaderboardUseCase {
  execute(userId: string, limit: number): Promise<CompanyLeaderboardDTO[]>;
}
