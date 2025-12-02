import { Request, Response } from "express";
import { IAuthUseCase } from "../../../domain/interfaces/usecases/auth/IAuthUseCase";
import { ICompleteSignupUseCase } from "../../../domain/interfaces/usecases/auth/ICompleteSignupUseCase";
import { IResentOtpUseCase } from "../../../domain/interfaces/usecases/auth/IResentOtpUsecase";
import logger from "../../../utils/logger";
import { ILoginUseCase } from "../../../domain/interfaces/usecases/auth/ILoginUseCase";
import { ITokenService } from "../../../domain/interfaces/services/ITokenService";
import { IGoogleAuthUseCase } from "../../../domain/interfaces/usecases/auth/IGoogleAuthUseCase";
import { IFindUserByemailUseCase } from "../../../domain/interfaces/usecases/auth/IFindUserByEmailUseCase";
import { IForgotPasswordUseCase } from "../../../domain/interfaces/usecases/auth/IForgotPasswordUseCase";
import { IForgotPasswordOtpVerify } from "../../../domain/interfaces/usecases/auth/IForgotPasswordOtpVerify";
import { ICreateNewPasswordUseCase } from "../../../domain/interfaces/usecases/auth/ICreateNewPasswordUseCase";
import { IcompanyFindUseCase } from "../../../domain/interfaces/usecases/company/ICompanyFindUseCase";
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
                throw new Error("All fields are required");

            }
            await this._RegisterUser.createUser({ name, email, password });
            res.status(200).json({ message: "Otp sent successfully" });
        }
        catch (error) {
            logger.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { otp, name, email, password } = req.body;
            logger.info(req.body);
            await this._completeSignupUseCase.otp(otp, name, email, password);
            res.status(200).json({ message: "user register successfull" });
        }
        catch (error: any) {

            res.status(400).json({ message: error?.message });
        }
    }
    async resentOtp(req: Request, res: Response): Promise<void> {
        try {
            const { name, email } = req.body;
            if (!email) {
                throw new Error(" Email are required");
            }
            await this._resentOtpUseCase.execute(name, email);
            res.json({
                success: true,
                message: "OTP resent successfully."
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
                throw new Error("User not found or missing id");
            }
            if (user.role !== role) {
                throw new Error(`You are not authorized to login from ${role} portal`);

            };

            const accessToken = await this._tokenServie.generateAccessToken(user?.email, user?.role);
            const refreshToken = await this._tokenServie.generateRefreshToken(user?.email, user?.role);
            if (!accessToken || !refreshToken) {
                throw new Error("something went wrong");
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
                message: "Login successfull",
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
            console.log("token here",token)
            if (!token) throw new Error("No refresh token found");
            const decoded = await this._tokenServie.verifyRefreshToken(token);
            const user = await this._findUserByEmailUseCase.execute(decoded?.email);
            if (!user) {
                throw new Error("user not exists");
            }
            if (user.status == "block") {
                throw new Error("Access denied. This account is blocked");
            }
            const accessToken = await this._tokenServie.generateAccessToken(decoded?.userId, decoded?.role);
            res.json({
                success: true,
                accessToken,
            });
        }
        catch (error) {
            console.log(error)
            res.status(400).json({
                success: false,
                message: "Refresh token expired or invalid",
            });
        }
    }
    async googleAuth(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, googleId } = req.body;
            if (!name || !email || !googleId || Object.keys(req.body).length === 0) {
                throw new Error("Request body is missing");
            }
            const user = await this._googleAuthUseCase.gooogleAuth(name, email, googleId);
            const accessToken = await this._tokenServie.generateAccessToken(email, "user");
            const refreshToken = await this._tokenServie.generateRefreshToken(email, "user");
            if (!accessToken || !refreshToken) {
                throw new Error("something went wrong");
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
                message: "Google login successful",
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
                throw new Error("email is required");
            }
            const user = await this._findUserByEmailUseCase.execute(email);
            if (!user) {
                throw new Error("No user found with this email");
            }

            if (base.startsWith("/company")&& !['companyUser', 'companyAdmin'].includes(user.role)){
               throw new Error("Access denied: Not a company account");
            } 

            if (user?.googleId) {
                throw new Error("This account is registered using Google Sign-In. Password reset is not applicable.");
            }
            await this._forgotPassword.execute(email);
            res.status(200).json({
                success: true,
                message: "OTP has been sent to your email",
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
            res.status(200).json({ message: "otp verify successfull" });
        }
        catch (error: any) {
            console.log(error);
            res.status(400).json({ message: error?.message });
        }
    }
    async createNewPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            console.log(email,password)
            await this._createNewPasswordUseCase.execute(email, password);
            res.status(200).json({
                success: true,
                message: "Password updated successfully."
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

            res.clearCookie("refresh_user", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/user"
            });
            res.status(200).json({ message: "Logout successful" });
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
                throw new Error("Admin not found or missing id");
            }
            if (admin.role !== role) {
                throw new Error(`You are not authorized to login from ${role} portal`);

            };

            const accessToken = await this._tokenServie.generateAccessToken(admin?.email, admin?.role);
            const refreshToken = await this._tokenServie.generateRefreshToken(admin?.email, admin?.role);

            if (!accessToken || !refreshToken) {
                throw new Error("something went wrong");
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
                message: "Login successfull",
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
            logger.info("email password",email,password)
            const user = await this._loginUseCase.execute(email, password);

            if (!user || !user._id) {
                throw new Error("User not found or missing id");
            }
            if (user.role !== "companyAdmin") {
                throw new Error("You are not authorized to login from company portal");

            };
            if (!user.CompanyId) {
                throw new Error("Access denied: Missing company association");
            }
            const company = await this._companyFindUseCase.execute(user?.CompanyId);
            const accessToken = await this._tokenServie.generateAccessToken(user?.email, user?.role);
            const refreshToken = await this._tokenServie.generateRefreshToken(user?.email, user?.role);
            if (!accessToken || !refreshToken) { 
                throw new Error("something went wrong");
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
                message: "Login successfull",
                accessToken,
                UserDeepCopy,
                company
            });
        }catch (error: any) {
            console.log("eror", error);
             res.status(400).json({
                success: false,
                message: error.message || "Something went wrong."
            });
        }
    }

    
}
