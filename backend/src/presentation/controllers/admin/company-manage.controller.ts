import { MESSAGES } from "../../../domain/constants/messages";
import { HttpStatus } from "../../constants/httpStatus";
import { ICompanyApproveRejectUseCase } from "../../../application/use-cases/interfaces/admin/company-approve-reject.interface";
import { IGetCompaniesUseCase } from "../../../application/use-cases/interfaces/admin/get-companies.interface";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import logger from "../../../utils/logger";
export class CompanyManageController {
  constructor(
    private _GetCompaniesUseCase: IGetCompaniesUseCase,
    private _companyApproveRejectUseCase: ICompanyApproveRejectUseCase,
  ) {}

  async getCompanys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companies = await this._GetCompaniesUseCase.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.COMPANIES_FETCHED_SUCCESS,
        data: companies,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateCompanyRequestStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const { status, reason } = req.body;
      // status: "approved" | "rejected"

      if (!companyId || !status) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }

      if (status === "active") {
        await this._companyApproveRejectUseCase.approve(companyId);

        logger.info("Company request approved successfully", { companyId });
        res.status(HttpStatus.OK).json({
          message: MESSAGES.COMPANY_APPROVED_SUCCESS,
        });
        return;
      }

      if (status === "reject") {
        await this._companyApproveRejectUseCase.reject(companyId, reason);

        logger.info("Company request rejected successfully", { companyId, reason });
        res.status(HttpStatus.OK).json({
          message: MESSAGES.COMPANY_REJECTED_SUCCESS,
        });
        return;
      }

      // throw new Error("Invalid status value");
    } catch (error: any) {
      next(error);
    }
  }
}
