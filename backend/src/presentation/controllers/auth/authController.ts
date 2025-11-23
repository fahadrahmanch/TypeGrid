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
        private _createNewPasswordUseCase: ICreateNewPasswordUseCase
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
            const { email, password } = req.body.data;
            const user = await this._loginUseCase.execute(email, password);

            if (!user || !user._id) {
                throw new Error("User not found or missing id");
            }
            const accessToken = await this._tokenServie.generateAccessToken(user?.email);
            const refreshToken = await this._tokenServie.generateRefreshToken(user?.email);
            if (!accessToken || !refreshToken) {
                throw new Error("something went wrong");
            }
            const UserDeepCopy = JSON.parse(JSON.stringify(user));
            delete UserDeepCopy.password;
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
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
            const token = req.cookies.refreshToken;
            const decoded = await this._tokenServie.verifyRefreshToken(token);
            const user = await this._findUserByEmailUseCase.execute(decoded?.email);
            if (!user) {
                throw new Error("user not exists");
            }
            if (user.status == "block") {
                throw new Error("Access denied. This account is blocked");
            }
            const accessToken = await this._tokenServie.generateAccessToken(decoded?.userId);
            res.json({
                success: true,
                accessToken,
            });
        }
        catch (error) {
            logger.info(error);
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
            const accessToken = await this._tokenServie.generateAccessToken(email);
            const refreshToken = await this._tokenServie.generateRefreshToken(email);
            if (!accessToken || !refreshToken) {
                throw new Error("something went wrong");
            }

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
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
            const { email } = req.body
            if (!email) {
                throw new Error("email is required")
            }
            const user = await this._findUserByEmailUseCase.execute(email)
            if (!user) {
                throw new Error("No user found with this email");
            }
            if (user?.googleId) {
                throw new Error("This account is registered using Google Sign-In. Password reset is not applicable.");
            }
            await this._forgotPassword.execute(email)
            res.status(200).json({
                success: true,
                message: "OTP has been sent to your email",
            });


        } catch (error: any) {
            console.error(error)
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async verifyForgotPasswordOtp(req: Request, res: Response): Promise<void> {
        try {
            const { otp, email } = req.body
            await this._ForgotPasswordOtpVerify.verify(otp, email)
            res.status(200).json({ message: "otp verify successfull" });
        }
        catch (error: any) {
            console.log(error)
            res.status(400).json({ message: error?.message });
        }
    }
    async createNewPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            await this._createNewPasswordUseCase.execute(email, password)
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

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            res.status(200).json({ message: "Logout successful" });
        }
        catch (error) {
            console.log(error)
        }
    }

}
