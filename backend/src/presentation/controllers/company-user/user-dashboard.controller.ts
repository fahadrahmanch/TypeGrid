import { Request, Response } from "express";
import { IGetUserDashboardStatsUseCase } from "../../../application/use-cases/interfaces/companyUser/get-user-dashboard-stats.interface";
import { HttpStatus } from "../../constants/httpStatus";
import { AuthRequest } from "../../../types/AuthRequest";
export class UserDashboardController {
  constructor(private _getUserDashboardStatsUseCase: IGetUserDashboardStatsUseCase) {}

  getStats = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const companyId = req.user?.companyId; 

    if (!userId || !companyId) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid User or Company context.",
      });
      return;
    }

    const stats = await this._getUserDashboardStatsUseCase.execute(userId, companyId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: stats
    });
  };
}
