import { IForgotPasswordUseCase } from "../../interfaces/auth/forgot-password.interface";
import { IOtpService } from "../../../../domain/interfaces/services/otp-service.interface";
import { IEmailService } from "../../../../domain/interfaces/services/email-service.interface";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { IEmailTemplate } from "../../../DTOs/email/email-template.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private _otpService: IOtpService,
    private _EmailService: IEmailService,
    private _authRepository: IAuthRepostory,
  ) {}
  async execute(email: string): Promise<void> {
    const user = await this._authRepository.findByEmail(email);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }
    const otp = await this._otpService.createOtp(email);
    const emailOptions: IEmailTemplate = {
      name: user.name,
      email,
      otp,
      subject: "TypeGrid Forgot Password OTP",
    };
    await this._EmailService.sentOtp(emailOptions);
  }
}
