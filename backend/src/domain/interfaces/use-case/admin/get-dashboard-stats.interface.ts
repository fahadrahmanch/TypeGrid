import { IDashboardStatsDTO } from "../../../../application/DTOs/admin/dashboard.dto";

export interface IGetDashboardStatsUseCase {
  execute(): Promise<IDashboardStatsDTO>;
}

