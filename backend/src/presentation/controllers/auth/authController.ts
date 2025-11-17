import { Request, Response } from "express";
import { IAuthUseCase } from "../../../domain/interfaces/usecases/auth/IAuthUseCase";
import { ICompleteSignupUseCase } from "../../../domain/interfaces/usecases/auth/ICompleteSignupUseCase";
import { IResentOtpUseCase } from "../../../domain/interfaces/usecases/auth/IResentOtpUsecase";
import logger from "../../../utils/logger";
import { ILoginUseCase } from "../../../domain/interfaces/usecases/auth/ILoginUseCase";
import { AuthUserEntity } from "../../../domain/entities";
import { ITokenService } from "../../../domain/interfaces/services/ITokenService";
export class authController {
    constructor(
        private _RegisterUser: IAuthUseCase,
        private _completeSignupUseCase: ICompleteSignupUseCase,
        private _resentOtpUseCase: IResentOtpUseCase,
        private _loginUseCase: ILoginUseCase,
        private _tokenServie: ITokenService
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
            res.status(500).json({ message: "Something went wrong" });
        }
    }
    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { otp, name, email, password } = req.body;
            logger.info(req.body);
            await this._completeSignupUseCase.otp(otp, name, email, password);
            res.status(200).json({ message: "user register successfull" })
        }
        catch (error: any) {

            res.status(400).json({ message: error?.message })
        }
    }
    async resentOtp(req: Request, res: Response): Promise<void> {
        try {
            const { name, email } = req.body
            console.log(req.body)
            if (!name || !email) {
                throw new Error("Name and Email are required")
            }
            await this._resentOtpUseCase.execute(name, email)
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
            const { email, password } = req.body.data
            const user = await this._loginUseCase.execute(email, password)

            if (!user || !user._id) {
                throw new Error("User not found or missing id");
            }
            const accessToken = await this._tokenServie.generateAccessToken(user?._id)
            const refreshToken = await this._tokenServie.generateRefreshToken(user?._id)
            if (!accessToken || !refreshToken) {
                throw new Error("something went wrong")
            }
            const UserDeepCopy = JSON.parse(JSON.stringify(user));
            delete UserDeepCopy.password
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
            })
        }
        catch (error: any) {
            logger.error(error)
            res.status(400).json({
                success: false,
                message: error.message || "Something went wrong",
            });
        }
    }
}
