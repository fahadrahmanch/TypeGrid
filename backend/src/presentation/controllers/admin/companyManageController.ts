import { MESSAGES } from "../../../domain/constants/messages";
import { ICompanyApproveRejectUsecase } from "../../../application/use-cases/interfaces/admin/ICompanyApproveRejectUsecase";
import { IGetCompanysUseCase } from "../../../application/use-cases/interfaces/admin/IGetCompanysUseCase";
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
        message: MESSAGES.COMPANIES_FETCHED_SUCCESS,
        data: companies,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch companies",
      });
    }
  }

 async updateCompanyRequestStatus(req: Request, res: Response): Promise<void> {
  try {
    const { companyId } = req.params;
    const { status, reason } = req.body; 
    // status: "approved" | "rejected"

    if (!companyId || !status) {
      res.status(400).json({
        message: MESSAGES.SOMETHING_WENT_WRONG,
      });
      return;
    }

    if (status === "active") {
      await this._companyApproveRejectUseCase.approve(companyId);

      res.status(200).json({
        message: MESSAGES.COMPANY_APPROVED_SUCCESS,
      });
      return;
    }

    if (status === "reject") {
      await this._companyApproveRejectUseCase.reject(
        companyId,
        reason
      );

      res.status(200).json({
        message: MESSAGES.COMPANY_REJECTED_SUCCESS,
      });
      return;
    }

    // invalid status value
    res.status(400).json({
      message: "Invalid status value",
    });

  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: MESSAGES.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
}



}
