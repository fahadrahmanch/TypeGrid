import { Request, Response } from "express";
import { IAuthUseCase } from "../../../domain/interfaces/useCases/auth/IAuthUseCase";
import { ICompleteSignupUseCase } from "../../../domain/interfaces/useCases/auth/ICompleteSignupUseCase";
import { IResentOtpUseCase } from "../../../domain/interfaces/useCases/auth/IResentOtpUsecase";
import logger from "../../../utils/logger";
import { ILoginUseCase } from "../../../domain/interfaces/useCases/auth/ILoginUseCase";
import { ITokenService } from "../../../domain/interfaces/services/ITokenService";
import { IGoogleAuthUseCase } from "../../../domain/interfaces/useCases/auth/IGoogleAuthUseCase";
import { IFindUserByemailUseCase } from "../../../domain/interfaces/useCases/auth/IFindUserByEmailUseCase";
import { IForgotPasswordUseCase } from "../../../domain/interfaces/useCases/auth/IForgotPasswordUseCase";
import { IForgotPasswordOtpVerify } from "../../../domain/interfaces/useCases/auth/IForgotPasswordOtpVerify";
import { ICreateNewPasswordUseCase } from "../../../domain/interfaces/useCases/auth/ICreateNewPasswordUseCase";
import { IcompanyFindUseCase } from "../../../domain/interfaces/useCases/auth/ICompanyFindUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
export class authController {
    constructor(
        private _RegisterUser: IAuthUseCase,
        private _completeSignupUseCase: ICompleteSignupUseCase,
        private _resentOtpUseCase: IResentOtpUseCase,
        private _loginUseCase: ILoginUseCase,
        private _tokenServie: ITokenService,
        private _googleAuthUseCase: IGoogleAuthUseCase,
        private _findUserByEmailUseCase: IFindUserByemailUseCase,
        private _forgotPassword: IForgotPasswordUseCase,
        private _ForgotPasswordOtpVerify: IForgotPasswordOtpVerify,
        private _createNewPasswordUseCase: ICreateNewPasswordUseCase,
        private _companyFindUseCase: IcompanyFindUseCase,
    ) {
    }
    async register(req: Request, res: Response): Promise<any> {
        try {
            const { name, email, password } = req.body;
            logger.info(req.body);
            if (!name || !email || !password) {
                throw new Error(MESSAGES.ALL_FIELDS_REQUIRED);

            }
            await this._RegisterUser.createUser({ name, email, password });
            res.status(200).json({ message: MESSAGES.OTP_SENT_SUCCESS });
        }
        catch (error:any) {
             console.error(error);
            res.status(500).json({ message:error.message});
        }
    }
    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { otp, name, email, password } = req.body;
            logger.info(req.body);
            await this._completeSignupUseCase.otp(otp, name, email, password);
            res.status(200).json({ message: MESSAGES.AUTH_REGISTER_SUCCESS });
        }
        catch (error: any) {

            res.status(400).json({ message: error?.message });
        }
    }
    async resentOtp(req: Request, res: Response): Promise<void> {
        try {
            const { name, email } = req.body;
            if (!email) {
                throw new Error(MESSAGES.EMAIL_REQUIRED);
            }
            await this._resentOtpUseCase.execute(name, email);
            res.json({
                success: true,
                message: MESSAGES.OTP_RESENT_SUCCESS
            });
        }
        catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Something went wrong",
            });
        }
    }
    async signin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, role } = req.body.data;
            const user = await this._loginUseCase.execute(email, password);

            if (!user || !user._id) {
                throw new Error(MESSAGES.USER_DETAILS_NOT_FOUND);
            }
            if (user.role !== role&&user.role!=="companyAdmin") {
                throw new Error(`You are not authorized to login from ${role} portal`);

            };

            const accessToken = await this._tokenServie.generateAccessToken(user?.email, user?.role);
            const refreshToken = await this._tokenServie.generateRefreshToken(user?.email, user?.role);
            if (!accessToken || !refreshToken) {
                throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
            }
            const UserDeepCopy = JSON.parse(JSON.stringify(user));
            delete UserDeepCopy.password;
            res.cookie("refresh_user", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/user"
            });
            res.json({
                message: MESSAGES.AUTH_LOGIN_SUCCESS,
                accessToken,
                UserDeepCopy
            });
        }
        catch (error: any) {
            logger.error(error);
            res.status(400).json({
                success: false,
                message: error.message || "Something went wrong",
            });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const base = req.baseUrl;
            let tokenName = "";
            let role = "";
            if (base.startsWith("/admin")) {
                tokenName = "refresh_admin";
                role = "admin";
            } else if (base.startsWith("/company")) {
                tokenName = "refresh_company";
                role = "company";
            } else if (base.startsWith("/user")) {
                tokenName = "refresh_user";
                role = "user";
            }
            const token = req.cookies[tokenName];
            
            if (!token) throw new Error(MESSAGES.REFRESH_TOKEN_NOT_FOUND);
            const decoded = await this._tokenServie.verifyRefreshToken(token);
            const user = await this._findUserByEmailUseCase.execute(decoded?.email);
            if (!user) {
                throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
            }
            if (user.status == "block") {
                throw new Error(MESSAGES.ACCOUNT_BLOCKED_ACCESS_DENIED);

            }
            const accessToken = await this._tokenServie.generateAccessToken(decoded?.userId, decoded?.role);
            res.json({
                success: true,
                accessToken,
                user
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).json({
                success: false,
                message: MESSAGES.REFRESH_TOKEN_EXPIRED_OR_INVALID
            });
        }
    }
    async googleAuth(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, googleId } = req.body;
            if (!name || !email || !googleId || Object.keys(req.body).length === 0) {
                throw new Error(MESSAGES.REQUEST_BODY_MISSING);
            }
            const user = await this._googleAuthUseCase.gooogleAuth(name, email, googleId);
            const accessToken = await this._tokenServie.generateAccessToken(email, "user");
            const refreshToken = await this._tokenServie.generateRefreshToken(email, "user");
            if (!accessToken || !refreshToken) {
                throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
            }

            res.cookie("refresh_user", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/user"
            });
            res.status(200).json({
                success: true,
                message: MESSAGES.GOOGLE_LOGIN_SUCCESS,
                user,
                accessToken
            });

        }
        catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Something went wrong during Google authentication"
            });
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const base = req.baseUrl;
            const { email } = req.body;
            if (!email) {
                throw new Error(MESSAGES.EMAIL_REQUIRED);
            }
            const user = await this._findUserByEmailUseCase.execute(email);
            if (!user) {
                throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
            }

            if (base.startsWith("/company")&& !["companyUser", "companyAdmin"].includes(user.role)){
               throw new Error(MESSAGES.ACCESS_DENIED_NOT_COMPANY);
            } 

            if (user?.googleId) {
               throw new Error(MESSAGES.GOOGLE_ACCOUNT_PASSWORD_RESET_NOT_ALLOWED);
            }
            await this._forgotPassword.execute(email);
            res.status(200).json({
                success: true,
                message: MESSAGES.OTP_SENT_SUCCESS,
            });


        } catch (error: any) {
            console.error(error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async verifyForgotPasswordOtp(req: Request, res: Response): Promise<void> {
        try {
            const { otp, email } = req.body;
            await this._ForgotPasswordOtpVerify.verify(otp, email);
            res.status(200).json({ message: MESSAGES.OTP_VERIFIED_SUCCESS });
        }
        catch (error: any) {
            console.log(error);
            res.status(400).json({ message: error?.message });
        }
    }
    async createNewPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            await this._createNewPasswordUseCase.execute(email, password);
            res.status(200).json({
                success: true,
                message: MESSAGES.PASSWORD_UPDATE_SUCCESS
            });
        }
        catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Something went wrong."
            });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
    const base = req.baseUrl;
            let tokenName = "";
            let path = "/";
            if (base.startsWith("/admin")) {
                tokenName = "refresh_admin";
                path = "/admin";
            } else if (base.startsWith("/company")) {
                tokenName = "refresh_company";
                path = "/company";
            } else if (base.startsWith("/user")) {
                tokenName = "refresh_user";
                path = "/user";
            }
            res.clearCookie(tokenName, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path
            });
            res.status(200).json({ message: MESSAGES.AUTH_LOGOUT_SUCCESS });
        }
        catch (error) {
            console.log(error);
        }
    }

    //admin
    async AdminSignIn(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, role } = req.body.data;
            const admin = await this._loginUseCase.execute(email, password);

            if (!admin || !admin._id) {
                throw new Error(MESSAGES.ADMIN_NOT_FOUND);
            }
            if (admin.role !== role) {
                throw new Error(`You are not authorized to login from ${role} portal`);

            };

            const accessToken = await this._tokenServie.generateAccessToken(admin?.email, admin?.role);
            const refreshToken = await this._tokenServie.generateRefreshToken(admin?.email, admin?.role);

            if (!accessToken || !refreshToken) {
                throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
            }
            const adminDeepCopy = JSON.parse(JSON.stringify(admin));
            delete adminDeepCopy.password;
            res.cookie("refresh_admin", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/admin"
            });
            res.json({
                message: MESSAGES.AUTH_LOGIN_SUCCESS,
                accessToken,
                adminDeepCopy
            });
        }
        catch (error: any) {
            console.log(error);
            res.status(400).json({
                success: false,
                message: error.message || "Something went wrong."
            });
        }


    }

    //company

    async companySignIn(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body.data;
            logger.info("email password",email,password);
            const user = await this._loginUseCase.execute(email, password);

            if (!user || !user._id) {
                throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
            }
            if (user.role !== "companyAdmin"&&user.role!=="companyUser") {
                throw new Error(MESSAGES.UNAUTHORIZED_COMPANY_PORTAL_ACCESS);
            };
            if (!user.CompanyId) {
                throw new Error(MESSAGES.MISSING_COMPANY_ASSOCIATION);
            }
            const company = await this._companyFindUseCase.execute(user?.CompanyId);
            const accessToken = await this._tokenServie.generateAccessToken(user?.email, user?.role);
            const refreshToken = await this._tokenServie.generateRefreshToken(user?.email, user?.role);
            if (!accessToken || !refreshToken) { 
                throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
            }
            const UserDeepCopy = JSON.parse(JSON.stringify(user));
            delete UserDeepCopy.password;
            res.cookie("refresh_company", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/company"
            });
            res.json({
                message: MESSAGES.AUTH_LOGIN_SUCCESS,
                accessToken,
                UserDeepCopy,
                company
            });
        }catch (error: any) {
             res.status(400).json({
                success: false,
                message: error.message || "Something went wrong."
            });
        }
    }

    
}
