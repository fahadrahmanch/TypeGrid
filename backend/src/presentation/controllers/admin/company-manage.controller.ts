import { MESSAGES } from '../../../domain/constants/messages';
import { HttpStatus } from '../../constants/httpStatus';
import { IApproveCompanyUseCase } from '../../../application/use-cases/interfaces/admin/approve-company.interface';
import { IRejectCompanyUseCase } from '../../../application/use-cases/interfaces/admin/reject-company.interface';
import { IGetCompaniesUseCase } from '../../../application/use-cases/interfaces/admin/get-companies.interface';
import { Request, Response } from 'express';
import logger from '../../../utils/logger';
import { CustomError } from '../../../domain/entities/custom-error.entity';

export class CompanyManageController {
  constructor(
    private _getCompaniesUseCase: IGetCompaniesUseCase,
    private _approveCompanyUseCase: IApproveCompanyUseCase,
    private _rejectCompanyUseCase: IRejectCompanyUseCase
  ) {}

  //company management

  getCompanies = async (req: Request, res: Response): Promise<void> => {
    const { status, searchText, page, limit } = req.query;
    const companies = await this._getCompaniesUseCase.execute(
      status as string,
      searchText as string,
      Number(page),
      Number(limit)
    );
    logger.info('Companies fetched successfully by admin');
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.COMPANIES_FETCHED_SUCCESS,
      total: companies.total,
      data: companies.companies,
    });
  };

  //company approval
  updateCompanyRequestStatus = async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;
    const { status, reason } = req.body;

    if (!companyId || !status) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    if (status === 'active') {
      await this._approveCompanyUseCase.execute(companyId);

      logger.info('Company request approved successfully', { companyId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.COMPANY_APPROVED_SUCCESS,
      });
      return;
    }

    if (status === 'reject') {
      if (!reason) {
        throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
      }

      await this._rejectCompanyUseCase.execute(companyId, reason);

      logger.info('Company request rejected successfully', {
        companyId,
        reason,
      });
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
  };
}
