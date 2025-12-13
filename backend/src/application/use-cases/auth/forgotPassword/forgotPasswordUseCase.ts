import { IForgotPasswordUseCase } from "../../../../domain/interfaces/usecases/auth/IForgotPasswordUseCase";
import { IOtpService } from "../../../../domain/interfaces/services/IOtpService";
import { IEmailService } from "../../../../domain/interfaces/services/IEmailService";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { IEmailTemplate } from "../../../../domain/interfaces/emailTemplates/IEmailTemplate";
import { MESSAGES } from "../../../../domain/constants/messages";
export class forgotPassword implements IForgotPasswordUseCase{
    constructor(
        private _otpService: IOtpService,
        private _EmailService: IEmailService,
        private _authRepository:IAuthRepostory
        
    ){}
    async execute(email:string):Promise<void>{
      const user = await this._authRepository.findByEmail(email);
            if (!user) {
                throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
            }
            const otp = await this._otpService.createOtp(email);
            const emailOptions: IEmailTemplate = {
                name:user.name,
                email,
                otp,
                subject: "TypeGrid Forgot Password OTP",
    
            };
            await this._EmailService.sentOtp(emailOptions);
    }
}