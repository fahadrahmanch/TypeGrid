import { Response } from "express";
import logger from "../../../utils/logger";
import { HttpStatus } from "../../constants/httpStatus";
import { AuthRequest } from "../../../types/AuthRequest";
import { ICompanyRequestUseCase } from "../../../application/use-cases/interfaces/user/company-request.interface";
import { ITokenService } from "../../../domain/interfaces/services/token-service.interface";
import { IFindUserUseCase } from "../../../application/use-cases/interfaces/user/find-user.interface";
import { IGetCompanyUseCase } from "../../../application/use-cases/interfaces/user/get-company.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { ICompanyReApplyUseCase } from "../../../application/use-cases/interfaces/user/company-re-apply.interface";
import { CustomError } from "../../../domain/entities/custom-error.entity";

export class CompanyRequestController {
  constructor(
    private _companyRequestUseCase: ICompanyRequestUseCase,
    private _tokenService: ITokenService,
    private _findUserUseCase: IFindUserUseCase,
    private _getCompanyStatusUseCase: IGetCompanyUseCase,
    private _companyReApplyUseCase: ICompanyReApplyUseCase
  ) {}
  companyRequestDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const { companyName, address, email, number, planId, document } = req.body;
    
    if (!companyName || !address || !email || !number || !document) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
    }

    const result = await this._companyRequestUseCase.execute(userId, companyName, address, email, number, planId, document);
    logger.info(MESSAGES.COMPANY_REQUEST_SUBMITTED_SUCCESS, {
      userId,
      companyName,
    });
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: MESSAGES.COMPANY_REQUEST_SUBMITTED_SUCCESS,
      data: result,
    });
  };

  reApplyCompanyDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const { companyName, address, email, number, document } = req.body;
    if (!companyName || !address || !email || !number || !document) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
    }
    await this._companyReApplyUseCase.execute({
      userId,
      email,
      companyName,
      number,
      address,
      document
    });
    logger.info(MESSAGES.COMPANY_DETAILS_REAPPLIED_SUCCESS, {
      userId,
      companyName,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.COMPANY_DETAILS_REAPPLIED_SUCCESS,
    });
  };

  getCompanyStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    const email = req.user?.email;
    if (!email) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const user = await this._findUserUseCase.execute(email);
    if (!user) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    if (!user.CompanyId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.COMPANY_NOT_ASSIGNED_TO_USER);
    }
    const company = await this._getCompanyStatusUseCase.execute(user.CompanyId as string);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.COMPANY_STATUS_FETCHED_SUCCESS,
      company,
    });
  };
}
