import { MESSAGES } from "../../../domain/constants/messages";
import { HttpStatus } from "../../constants/httpStatus";
import { ICompanyApproveRejectUseCase } from "../../../application/use-cases/interfaces/admin/company-approve-reject.interface";
import { IGetCompaniesUseCase } from "../../../application/use-cases/interfaces/admin/get-companies.interface";
import { Request, Response, NextFunction } from "express";
import logger from "../../../utils/logger";

export class CompanyManageController {
  constructor(
    private _getCompaniesUseCase: IGetCompaniesUseCase,
    private _companyApproveRejectUseCase: ICompanyApproveRejectUseCase,
  ) {}

  async getCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companies = await this._getCompaniesUseCase.execute();
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

      if (!companyId || !status) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INVALID_REQUEST,
        });
        return;
      }

      if (status === "active") {
        await this._companyApproveRejectUseCase.approve(companyId);

        logger.info("Company request approved successfully", { companyId });
        res.status(HttpStatus.OK).json({
          success: true,
          message: MESSAGES.COMPANY_APPROVED_SUCCESS,
        });
        return;
      }

      if (status === "reject") {
        if (!reason) {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: MESSAGES.ALL_FIELDS_REQUIRED,
          });
          return;
        }

        await this._companyApproveRejectUseCase.reject(companyId, reason);

        logger.info("Company request rejected successfully", { companyId, reason });
        res.status(HttpStatus.OK).json({
          success: true,
          message: MESSAGES.COMPANY_REJECTED_SUCCESS,
        });
        return;
      }

      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.INVALID_REQUEST,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
