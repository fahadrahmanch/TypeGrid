import { Request, Response } from "express";
import { ICompanyRequestUseCase } from "../../../domain/interfaces/user/ICompanyRequestUseCase";
import { ITokenService } from "../../../domain/interfaces/services/ITokenService";
import { IFindUserUseCase } from "../../../domain/interfaces/user/IFindUserUseCase";
import { IGetCompanyUseCase } from "../../../domain/interfaces/user/IGetCompanyUseCase";
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
      console.log("token companyDetails",token)

      if (!token) {
        throw new Error("Unauthorized - Token missing");
      }

      const decoded = await this._tokenService.verifyRefreshToken(token);

      if (!decoded?.email) {
        throw new Error("Invalid token");
      }

      const user = await this._findUserUseCase.execute(decoded.email);

      if (!user || !user._id) {
        throw new Error("User not found");
      }
      const { companyName, address, email, number } = req.body;

      if (!companyName || !address || !email || !number) {
        throw new Error("All fields are required");
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
        message: "Company request submitted successfully",
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
      const token = req.cookies.refreshToken;
      if (!token) {
        throw new Error("something went wrong");
      }
      const { email } = await this._tokenService.verifyRefreshToken(token);
      const user = await this._findUserUseCase.execute(email);
      if (!user) {
        throw new Error("something went wrong");
      }
      if (!user.CompanyId) {
        throw new Error("Access denied. Company not assigned to this user.");
      }
      const company = await this._GetCompanyStatusUseCase.execute(
        user.CompanyId
      );
      res.status(200).json({
        message: "Company status fetched successfully",
        company,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }
}
