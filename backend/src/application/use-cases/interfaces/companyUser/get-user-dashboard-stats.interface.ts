import { ICompanyUserDashboardStatsDTO } from "../../../DTOs/companyUser/dashboard.dto";

export interface IGetUserDashboardStatsUseCase {
  execute(userId: string, companyId: string): Promise<ICompanyUserDashboardStatsDTO>;
}
