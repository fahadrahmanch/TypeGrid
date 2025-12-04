import { ICompanyApproveRejectUsecase } from "../../../domain/interfaces/usecases/admin/ICompanyApproveRejectUsecase";
import { IGetCompanysUseCase } from "../../../domain/interfaces/usecases/admin/IGetCompanysUseCase";
import { Request, Response } from "express";
export class companyManageController {
  constructor(
    private _getCompanysUseCase: IGetCompanysUseCase,
    private _companyApproveRejectUseCase: ICompanyApproveRejectUsecase
  ) {}

  async getCompanys(req: Request, res: Response): Promise<void> {
    try {
      const companies = await this._getCompanysUseCase.execute();
      res.status(200).json({
        success: true,
        message: "Companies fetched successfully",
        data: companies,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch companies",
      });
    }
  }

  //approve
  async approve(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.body._id;
      if (!companyId) {
        throw new Error("something went wrong");
      }
      await this._companyApproveRejectUseCase.approve(companyId);
      res.status(200).json({
        message: "Company approved successfully",
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error while approving company",
        error: error.message,
      });
    }
  }

  async reject(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.body._id;
      if (!companyId) {
        throw new Error("something went wrong");
      }
        await this._companyApproveRejectUseCase.reject(companyId);
      res.status(200).json({
        message: "Company rejected successfully",
      });

    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error while approving company",
        error: error.message,
      });
    }
  }
}
