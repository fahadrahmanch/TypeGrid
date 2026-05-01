import { Request, Response } from "express";
import { IGetDashboardStatsUseCase } from "../../../domain/interfaces/use-case/admin/get-dashboard-stats.interface";
import { HttpStatus } from "../../constants/httpStatus";

export class AdminDashboardController {
  constructor(private _getDashboardStatsUseCase: IGetDashboardStatsUseCase) {}

  getStats = async (req: Request, res: Response): Promise<void> => {
    const stats = await this._getDashboardStatsUseCase.execute();
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: stats
    });
  };
}
