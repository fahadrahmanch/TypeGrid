import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { IEmailService } from "../../../../domain/interfaces/services/IEmailService";
import { IOtpService } from "../../../../domain/interfaces/services/IOtpService";
import { IEmailTemplate } from "../../../../domain/interfaces/emailTemplates/IEmailTemplate";
export class resentOtpUseCase {
    constructor(
        private _otpService: IOtpService,
        private _emailService: IEmailService,
        private _authRepository: IAuthRepostory
    ) { }
    async execute(name: string, email: string): Promise<void> {
        const exitsUser = await this._authRepository.findByEmail(email)
        if (exitsUser) {
            throw new Error("User already exists with this email");
        }
        const otp = await this._otpService.createOtp(email)
        const emailOptions: IEmailTemplate = {
            name,
            email,
            otp,
            subject: "Type Grid Sign Up Otp",

        };
        await this._emailService.sentOtp(emailOptions);
        console.log("hello")
    }

}