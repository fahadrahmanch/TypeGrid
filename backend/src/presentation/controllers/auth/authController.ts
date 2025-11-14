import { Request, Response } from "express";
import { IAuthUseCase } from "../../../domain/interfaces/usecases/auth/IAuthUseCase";
import { ICompleteSignupUseCase } from "../../../domain/interfaces/usecases/auth/ICompleteSignupUseCase";
import { IResentOtpUseCase } from "../../../domain/interfaces/usecases/auth/IResentOtpUsecase";
import logger from "../../../utils/logger";

import { AuthUserEntity } from "../../../domain/entities";
export class authController {
    constructor(
        private _RegisterUser: IAuthUseCase,
        private _completeSignupUseCase: ICompleteSignupUseCase,
        private _resentOtpUseCase: IResentOtpUseCase
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
}