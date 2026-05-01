import { ICompanyDashboardStatsDTO } from "../../../DTOs/companyAdmin/dashboard.dto";

export interface IGetCompanyDashboardStatsUseCase {
  execute(companyId: string): Promise<ICompanyDashboardStatsDTO>;
}
