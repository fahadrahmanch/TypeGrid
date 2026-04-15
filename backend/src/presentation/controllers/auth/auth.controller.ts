import { Request, Response, NextFunction } from "express";
import { IAuthUseCase } from "../../../application/use-cases/interfaces/auth/auth.interface";
import { ICompleteSignupUseCase } from "../../../application/use-cases/interfaces/auth/complete-signup.interface";
import { IResentOtpUseCase } from "../../../application/use-cases/interfaces/auth/resent-otp.interface";
import logger from "../../../utils/logger";
import { ILoginUseCase } from "../../../application/use-cases/interfaces/auth/login.interface";
import { ITokenService } from "../../../domain/interfaces/services/token-service.interface";
import { IGoogleAuthUseCase } from "../../../application/use-cases/interfaces/auth/google-auth.interface";
import { IFindUserByemailUseCase } from "../../../application/use-cases/interfaces/auth/find-user-by-email.interface";
import { IForgotPasswordUseCase } from "../../../application/use-cases/interfaces/auth/forgot-password.interface";
import { IForgotPasswordOtpVerifyUseCase } from "../../../application/use-cases/interfaces/auth/forgot-password-otp-verify.interface";
import { ICreateNewPasswordUseCase } from "../../../application/use-cases/interfaces/auth/create-new-password.interface";
import { ICompanyFindUseCase } from "../../../application/use-cases/interfaces/auth/company-find.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { HttpStatus } from "../../constants/httpStatus";
import { getRoleConfig } from "../../helpers/auth-role.helper";
import { mapToSafeUser } from "../../../application/mappers/auth/auth.mapper";
import { Status } from "../../../domain/enums/status.enum";

export class AuthController {
  constructor(
    private _registerUserUseCase: IAuthUseCase,
    private _completeSignupUseCase: ICompleteSignupUseCase,
    private _resentOtpUseCase: IResentOtpUseCase,
    private _loginUseCase: ILoginUseCase,
    private _tokenService: ITokenService,
    private _googleAuthUseCase: IGoogleAuthUseCase,
    private _findUserByEmailUseCase: IFindUserByemailUseCase,
    private _forgotPasswordUseCase: IForgotPasswordUseCase,
    private _forgotPasswordOtpVerifyUseCase: IForgotPasswordOtpVerifyUseCase,
    private _createNewPasswordUseCase: ICreateNewPasswordUseCase,
    private _companyFindUseCase: ICompanyFindUseCase,
  ) { }

  //user register
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ALL_FIELDS_REQUIRED,
        });
        return;
      }
      //create user
      await this._registerUserUseCase.execute({
        name,
        email,
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.OTP_SENT_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  //verify otp
  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { otp, name, email, password } = req.body;
      logger.info("Verifying OTP", { email });
      await this._completeSignupUseCase.execute(otp, name, email, password);
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.AUTH_REGISTER_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  //resentOtp

  async resentOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email } = req.body;
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.EMAIL_REQUIRED,
        });
        return;
      }
      await this._resentOtpUseCase.execute(name, email);
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.OTP_RESENT_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  // normal user signin and company admin signin into normal side
  async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, role } = req.body.data;
      const user = await this._loginUseCase.execute(email, password, [
        role,
        "companyAdmin",
      ]);

      if (!user || !user._id) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.USER_DETAILS_NOT_FOUND,
        });
        return;
      }
      //generate accesstoken
      const accessToken = await this._tokenService.generateAccessToken(
        user._id,
        user?.email,
        user?.role,
      );
      // generate refreshToken
      const refreshToken = await this._tokenService.generateRefreshToken(
        user._id,
        user?.email,
        user?.role,
      );

      if (!accessToken || !refreshToken) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }
      //remove password from user
      const safeUser = mapToSafeUser(user);
      //set refresh token in cookie
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/user",
      });

      logger.info("User signed in successfully", { email });

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.AUTH_LOGIN_SUCCESS,
        accessToken,
        user: safeUser,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  // refresh-token
  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { tokenName } = getRoleConfig(req.baseUrl);
      const token = req.cookies[tokenName];

      if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.REFRESH_TOKEN_NOT_FOUND,
        });
        return;
      }

      const decoded = await this._tokenService.verifyRefreshToken(token);
      const user = await this._findUserByEmailUseCase.execute(decoded?.email);

      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }

      if (user.status === Status.BLOCK) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: MESSAGES.ACCOUNT_BLOCKED_ACCESS_DENIED,
        });
        return;
      }
      const accessToken = await this._tokenService.generateAccessToken(
        decoded?.userId,
        decoded?.email,
        decoded?.role,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        accessToken,
        user: mapToSafeUser(user),
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  // google-auth

  async googleAuth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, googleId } = req.body;
      if (!name || !email || !googleId || Object.keys(req.body).length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.REQUEST_BODY_MISSING,
        });
        return;
      }

      const user = await this._googleAuthUseCase.execute(name, email, googleId);

      if (!user || !user._id) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }
      //generate access token
      const accessToken = await this._tokenService.generateAccessToken(
        user._id.toString(),
        email,
        "user",
      );
      //generate refresh token
      const refreshToken = await this._tokenService.generateRefreshToken(
        user._id.toString(),
        email,
        "user",
      );

      if (!accessToken || !refreshToken) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }

      const safeUser = mapToSafeUser(user);
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/user",
      });

      logger.info("Google Authentication successful", { email });

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.GOOGLE_LOGIN_SUCCESS,
        user: safeUser,
        accessToken,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  // forgot-password user
  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const base = req.baseUrl;
      const { email } = req.body;
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.EMAIL_REQUIRED,
        });
        return;
      }

      const user = await this._findUserByEmailUseCase.execute(email);
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }

      if (
        base.startsWith("/company") &&
        !["companyUser", "companyAdmin"].includes(user.role)
      ) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: MESSAGES.ACCESS_DENIED_NOT_COMPANY,
        });
        return;
      }

      if (user?.googleId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.GOOGLE_ACCOUNT_PASSWORD_RESET_NOT_ALLOWED,
        });
        return;
      }

      await this._forgotPasswordUseCase.execute(email);

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.OTP_SENT_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  // verify-forgot-password-otp
  async verifyForgotPasswordOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { otp, email } = req.body;
      await this._forgotPasswordOtpVerifyUseCase.execute(otp, email);
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.OTP_VERIFIED_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  //rest password user

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      await this._createNewPasswordUseCase.execute(email, password);
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.PASSWORD_UPDATE_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  //logout
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tokenName, path } = getRoleConfig(req.baseUrl);

      res.clearCookie(tokenName, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path,
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.AUTH_LOGOUT_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  //admin signin
  async AdminSignIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password, role } = req.body.data;
      const admin = await this._loginUseCase.execute(email, password, [role]);

      if (!admin || !admin._id) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.ADMIN_NOT_FOUND,
        });
        return;
      }

      const accessToken = await this._tokenService.generateAccessToken(
        admin?._id.toString(),
        admin?.email,
        admin?.role,
      );
      const refreshToken = await this._tokenService.generateRefreshToken(
        admin?._id.toString(),
        admin?.email,
        admin?.role,
      );

      if (!accessToken || !refreshToken) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }

      const safeAdmin = mapToSafeUser(admin);

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/admin",
      });

      logger.info("Admin signed in successfully", { email });

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.AUTH_LOGIN_SUCCESS,
        accessToken,
        user: safeAdmin,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  //company signin

  async companySignIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body.data;
      const user = await this._loginUseCase.execute(email, password, [
        "companyAdmin",
        "companyUser",
      ]);

      if (!user || !user._id) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      if (!user.CompanyId) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: MESSAGES.MISSING_COMPANY_ASSOCIATION,
        });
        return;
      }

      const company = await this._companyFindUseCase.execute(user?.CompanyId);

      const accessToken = await this._tokenService.generateAccessToken(
        user?._id.toString(),
        user?.email,
        user?.role,
      );
      const refreshToken = await this._tokenService.generateRefreshToken(
        user?._id.toString(),
        user?.email,
        user?.role,
      );

      if (!accessToken || !refreshToken) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }

      const safeUser = mapToSafeUser(user);

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/company",
      });

      logger.info("Company signed in successfully", { email });

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.AUTH_LOGIN_SUCCESS,
        accessToken,
        user: safeUser,
        company,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
