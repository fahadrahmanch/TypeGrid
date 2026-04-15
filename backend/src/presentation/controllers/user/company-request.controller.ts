import { Response, NextFunction } from "express";
import logger from "../../../utils/logger";
import { HttpStatus } from "../../constants/httpStatus";
import { AuthRequest } from "../../../types/AuthRequest";
import { ICompanyRequestUseCase } from "../../../application/use-cases/interfaces/user/company-request.interface";
import { ITokenService } from "../../../domain/interfaces/services/token-service.interface";
import { IFindUserUseCase } from "../../../application/use-cases/interfaces/user/find-user.interface";
import { IGetCompanyUseCase } from "../../../application/use-cases/interfaces/user/get-company.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { ICompanyReApplyUseCase } from "../../../application/use-cases/interfaces/user/company-re-apply.interface";

export class CompanyRequestController {
  constructor(
    private _companyRequestUseCase: ICompanyRequestUseCase,
    private _tokenService: ITokenService,
    private _findUserUseCase: IFindUserUseCase,
    private _getCompanyStatusUseCase: IGetCompanyUseCase,
    private _companyReApplyUseCase: ICompanyReApplyUseCase,
  ) {}
  async companyRequestDetails(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }

      const { companyName, address, email, number,planId } = req.body;
      
      if (!companyName || !address || !email || !number) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ALL_FIELDS_REQUIRED,
        });
        return;
      }

      const result = await this._companyRequestUseCase.execute(
        userId,
        companyName,
        address,
        email,
        number,
        planId,
      );
      logger.info("Company request submitted successfully", {
        userId,
        companyName,
      });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGES.COMPANY_REQUEST_SUBMITTED_SUCCESS,
        data: result,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async reApplyCompanyDetails(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }

      const { companyName, address, email, number } = req.body;
      if (!companyName || !address || !email || !number) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ALL_FIELDS_REQUIRED,
        });
        return;
      }
      await this._companyReApplyUseCase.execute({
        userId,
        email,
        companyName,
        number,
        address,
      });
      logger.info("Company details re-applied successfully", {
        userId,
        companyName,
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Company details re-applied successfully",
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getCompanyStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const email = req.user?.email;
      if (!email) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      const user = await this._findUserUseCase.execute(email);
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      if (!user.CompanyId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.COMPANY_NOT_ASSIGNED_TO_USER,
        });
        return;
      }
      const company = await this._getCompanyStatusUseCase.execute(
        user.CompanyId,
      );
      res.status(HttpStatus.OK).json({
        message: MESSAGES.COMPANY_STATUS_FETCHED_SUCCESS,
        company,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
