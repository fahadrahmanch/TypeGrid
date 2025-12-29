import { MESSAGES } from "../../../domain/constants/messages";
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

  //approve
  async approve(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.body._id;
      if (!companyId) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      await this._companyApproveRejectUseCase.approve(companyId);
      res.status(200).json({
        message: MESSAGES.COMPANY_APPROVED_SUCCESS,
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        message:  MESSAGES.COMPANY_APPROVAL_SERVER_ERROR,
        error: error.message,
      });
    }
  }

  async reject(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.body._id;
      const rejectionReason=req.body.reason
      if (!companyId) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      await this._companyApproveRejectUseCase.reject(companyId,rejectionReason);
      res.status(200).json({
        message: MESSAGES.COMPANY_REJECTED_SUCCESS,
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
