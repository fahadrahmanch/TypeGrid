import { Request, Response, NextFunction } from "express";
import logger from "../../../utils/logger";
import { HttpStatus } from "../../constants/httpStatus";
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
    private _GetCompanyStatusUseCase: IGetCompanyUseCase,
    private _companyReApplyUseCase: ICompanyReApplyUseCase,
  ) {}
  async companyRequestDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.refresh_user;
      if (!token) {
        throw new Error(MESSAGES.AUTH_TOKEN_MISSING);
      }

      const decoded = await this._tokenService.verifyRefreshToken(token);

      if (!decoded?.email) {
        throw new Error(MESSAGES.AUTH_TOKEN_INVALID);
      }

      const user = await this._findUserUseCase.execute(decoded.email);

      if (!user || !user._id) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const { companyName, address, email, number } = req.body;

      if (!companyName || !address || !email || !number) {
        throw new Error(MESSAGES.ALL_FIELDS_REQUIRED);
      }

      const result = await this._companyRequestUseCase.execute(
        user._id,
        companyName,
        address,
        email,
        number,
      );
      logger.info("Company request submitted successfully", { userId: user._id, companyName });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGES.COMPANY_REQUEST_SUBMITTED_SUCCESS,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async reApplyCompanyDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.refresh_user;

      if (!token) {
        throw new Error(MESSAGES.AUTH_TOKEN_MISSING);
      }

      const decoded = await this._tokenService.verifyRefreshToken(token);

      if (!decoded?.email) {
        throw new Error(MESSAGES.AUTH_TOKEN_INVALID);
      }

      const user = await this._findUserUseCase.execute(decoded.email);

      if (!user || !user._id) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const { companyName, address, email, number } = req.body;
      if (!companyName || !address || !email || !number) {
        throw new Error(MESSAGES.ALL_FIELDS_REQUIRED);
      }
      await this._companyReApplyUseCase.execute({
        userId: user._id,
        email,
        companyName,
        number,
        address,
      });
      logger.info("Company details re-applied successfully", { userId: user._id, companyName });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Company details re-applied successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getCompanyStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.refresh_user;
      if (!token) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      const { email } = await this._tokenService.verifyRefreshToken(token);
      const user = await this._findUserUseCase.execute(email);
      if (!user) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      if (!user.CompanyId) {
        throw new Error(MESSAGES.COMPANY_NOT_ASSIGNED_TO_USER);
      }
      const company = await this._GetCompanyStatusUseCase.execute(
        user.CompanyId,
      );
      res.status(HttpStatus.OK).json({
        message: MESSAGES.COMPANY_STATUS_FETCHED_SUCCESS,
        company,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
