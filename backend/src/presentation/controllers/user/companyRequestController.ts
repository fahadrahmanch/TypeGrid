import { Request, Response } from "express";
import { ICompanyRequestUseCase } from "../../../domain/interfaces/user/ICompanyRequestUseCase";
import { ITokenService } from "../../../domain/interfaces/services/ITokenService";
import { IFindUserUseCase } from "../../../domain/interfaces/user/IFindUserUseCase";
import { IGetCompanyUseCase } from "../../../domain/interfaces/user/IGetCompanyUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
export class companyRequestController {
  constructor(
    private _companyRequestUseCase: ICompanyRequestUseCase,
    private _tokenService: ITokenService,
    private _findUserUseCase: IFindUserUseCase,
    private _GetCompanyStatusUseCase: IGetCompanyUseCase
  ) {}
  async companyDetails(req: Request, res: Response): Promise<void> {
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
        number
      );
      res.status(201).json({
        success: true,
        message: MESSAGES.COMPANY_REQUEST_SUBMITTED_SUCCESS,
        data: result,
      });
    } catch (error: any) {
      console.error("Company Request Error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getCompanyStatus(req: Request, res: Response): Promise<void> {
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
        user.CompanyId
      );
      res.status(200).json({
        message:  MESSAGES.COMPANY_STATUS_FETCHED_SUCCESS,
        company,
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }
}
