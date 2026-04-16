import { Request, Response } from 'express';
import { IAuthUseCase } from '../../../application/use-cases/interfaces/auth/auth.interface';
import { ICompleteSignupUseCase } from '../../../application/use-cases/interfaces/auth/complete-signup.interface';
import { IResentOtpUseCase } from '../../../application/use-cases/interfaces/auth/resent-otp.interface';
import logger from '../../../utils/logger';
import { ILoginUseCase } from '../../../application/use-cases/interfaces/auth/login.interface';
import { ITokenService } from '../../../domain/interfaces/services/token-service.interface';
import { IGoogleAuthUseCase } from '../../../application/use-cases/interfaces/auth/google-auth.interface';
import { IFindUserByemailUseCase } from '../../../application/use-cases/interfaces/auth/find-user-by-email.interface';
import { IForgotPasswordUseCase } from '../../../application/use-cases/interfaces/auth/forgot-password.interface';
import { IForgotPasswordOtpVerifyUseCase } from '../../../application/use-cases/interfaces/auth/forgot-password-otp-verify.interface';
import { ICreateNewPasswordUseCase } from '../../../application/use-cases/interfaces/auth/create-new-password.interface';
import { ICompanyFindUseCase } from '../../../application/use-cases/interfaces/auth/company-find.interface';
import { MESSAGES } from '../../../domain/constants/messages';
import { HttpStatus } from '../../constants/httpStatus';
import { getRoleConfig } from '../../helpers/auth-role.helper';
import { mapToSafeUser } from '../../../application/mappers/auth/auth.mapper';
import { Status } from '../../../domain/enums/status.enum';
import { CustomError } from '../../../domain/entities/custom-error.entity';

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
    private _companyFindUseCase: ICompanyFindUseCase
  ) {}

  //user register
  register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
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
  };
  //verify otp
  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { otp, name, email, password } = req.body;
    logger.info('Verifying OTP', { email });
    await this._completeSignupUseCase.execute(otp, name, email, password);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.AUTH_REGISTER_SUCCESS,
    });
  };
  //resentOtp

  resentOtp = async (req: Request, res: Response): Promise<void> => {
    const { name, email } = req.body;
    if (!email) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.EMAIL_REQUIRED);
    }
    await this._resentOtpUseCase.execute(name, email);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.OTP_RESENT_SUCCESS,
    });
  };

  // normal user signin and company admin signin into normal side
  signin = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body.data;
    const user = await this._loginUseCase.execute(email, password, [role, 'companyAdmin']);

    if (!user || !user._id) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.USER_DETAILS_NOT_FOUND);
    }
    //generate accesstoken
    const accessToken = await this._tokenService.generateAccessToken(user._id, user?.email, user?.role);
    // generate refreshToken
    const refreshToken = await this._tokenService.generateRefreshToken(user._id, user?.email, user?.role);

    if (!accessToken || !refreshToken) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }
    //remove password from user
    const safeUser = mapToSafeUser(user);
    //set refresh token in cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/user',
    });

    logger.info('User signed in successfully', { email });

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.AUTH_LOGIN_SUCCESS,
      accessToken,
      user: safeUser,
    });
  };
  // refresh-token
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { tokenName } = getRoleConfig(req.baseUrl);
    const token = req.cookies[tokenName];

    if (!token) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.REFRESH_TOKEN_NOT_FOUND);
    }

    const decoded = await this._tokenService.verifyRefreshToken(token);
    const user = await this._findUserByEmailUseCase.execute(decoded?.email);

    if (!user) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    if (user.status === Status.BLOCK) {
      throw new CustomError(HttpStatus.FORBIDDEN, MESSAGES.ACCOUNT_BLOCKED_ACCESS_DENIED);
    }
    const accessToken = await this._tokenService.generateAccessToken(decoded?.userId, decoded?.email, decoded?.role);

    res.status(HttpStatus.OK).json({
      success: true,
      accessToken,
      user: mapToSafeUser(user),
    });
  };
  // google-auth

  googleAuth = async (req: Request, res: Response): Promise<void> => {
    const { name, email, googleId } = req.body;
    if (!name || !email || !googleId || Object.keys(req.body).length === 0) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.REQUEST_BODY_MISSING);
    }

    const user = await this._googleAuthUseCase.execute(name, email, googleId);

    if (!user || !user._id) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }
    //generate access token
    const accessToken = await this._tokenService.generateAccessToken(user._id.toString(), email, 'user');
    //generate refresh token
    const refreshToken = await this._tokenService.generateRefreshToken(user._id.toString(), email, 'user');

    if (!accessToken || !refreshToken) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }

    const safeUser = mapToSafeUser(user);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/user',
    });

    logger.info('Google Authentication successful', { email });

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.GOOGLE_LOGIN_SUCCESS,
      user: safeUser,
      accessToken,
    });
  };
  // forgot-password user
  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const base = req.baseUrl;
    const { email } = req.body;
    if (!email) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.EMAIL_REQUIRED);
    }

    const user = await this._findUserByEmailUseCase.execute(email);
    if (!user) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    if (base.startsWith('/company') && !['companyUser', 'companyAdmin'].includes(user.role)) {
      throw new CustomError(HttpStatus.FORBIDDEN, MESSAGES.ACCESS_DENIED_NOT_COMPANY);
    }

    if (user?.googleId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.GOOGLE_ACCOUNT_PASSWORD_RESET_NOT_ALLOWED);
    }

    await this._forgotPasswordUseCase.execute(email);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.OTP_SENT_SUCCESS,
    });
  };
  // verify-forgot-password-otp
  verifyForgotPasswordOtp = async (req: Request, res: Response): Promise<void> => {
    const { otp, email } = req.body;
    await this._forgotPasswordOtpVerifyUseCase.execute(otp, email);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.OTP_VERIFIED_SUCCESS,
    });
  };
  //rest password user

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    await this._createNewPasswordUseCase.execute(email, password);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.PASSWORD_UPDATE_SUCCESS,
    });
  };
  //logout
  logout = async (req: Request, res: Response): Promise<void> => {
    const { tokenName, path } = getRoleConfig(req.baseUrl);

    res.clearCookie(tokenName, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.AUTH_LOGOUT_SUCCESS,
    });
  };

  //admin signin
  AdminSignIn = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body.data;
    const admin = await this._loginUseCase.execute(email, password, [role]);

    if (!admin || !admin._id) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.ADMIN_NOT_FOUND);
    }

    const accessToken = await this._tokenService.generateAccessToken(admin?._id.toString(), admin?.email, admin?.role);
    const refreshToken = await this._tokenService.generateRefreshToken(
      admin?._id.toString(),
      admin?.email,
      admin?.role
    );

    if (!accessToken || !refreshToken) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }

    const safeAdmin = mapToSafeUser(admin);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/admin',
    });

    logger.info('Admin signed in successfully', { email });

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.AUTH_LOGIN_SUCCESS,
      accessToken,
      user: safeAdmin,
    });
  };

  //company signin

  companySignIn = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body.data;
    const user = await this._loginUseCase.execute(email, password, ['companyAdmin', 'companyUser']);

    if (!user || !user._id) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    if (!user.CompanyId) {
      throw new CustomError(HttpStatus.FORBIDDEN, MESSAGES.MISSING_COMPANY_ASSOCIATION);
    }

    const company = await this._companyFindUseCase.execute(user?.CompanyId);

    const accessToken = await this._tokenService.generateAccessToken(user?._id.toString(), user?.email, user?.role);
    const refreshToken = await this._tokenService.generateRefreshToken(user?._id.toString(), user?.email, user?.role);

    if (!accessToken || !refreshToken) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }

    const safeUser = mapToSafeUser(user);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/company',
    });

    logger.info('Company signed in successfully', { email });

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.AUTH_LOGIN_SUCCESS,
      accessToken,
      user: safeUser,
      company,
    });
  };
}
