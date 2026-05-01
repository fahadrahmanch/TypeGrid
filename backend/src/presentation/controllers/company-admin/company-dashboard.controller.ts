import { Request, Response } from "express";
import { IGetCompanyDashboardStatsUseCase } from "../../../application/use-cases/interfaces/companyAdmin/get-dashboard-stats.interface";
import { HttpStatus } from "../../constants/httpStatus";

export class CompanyDashboardController {
  constructor(private _getDashboardStatsUseCase: IGetCompanyDashboardStatsUseCase) {}

  getStats = async (req: Request, res: Response): Promise<void> => {
    const companyId = (req as any).user?.CompanyId || (req as any).user?.companyId; 

    if (!companyId) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Company ID not found in user context.",
      });
      return;
    }

    const stats = await this._getDashboardStatsUseCase.execute(companyId);
    
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: stats
    });
  };
}
