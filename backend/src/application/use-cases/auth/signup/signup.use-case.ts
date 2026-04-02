import { IAuthUseCase } from "../../interfaces/auth/auth.interface";
import { IAuthRepository } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { IOtpService } from "../../../../domain/interfaces/services/otp-service.interface";
import { IEmailService } from "../../../../domain/interfaces/services/email-service.interface";
import { IEmailTemplate } from "../../../DTOs/email/email-template.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Handles user signup by validating input, checking for existing email,
 * and sending an OTP for verification.
 */
export class SignupUseCase implements IAuthUseCase {
  constructor(
    private readonly _authRepository: IAuthRepository,
    private readonly _otpService: IOtpService,
    private readonly _emailService: IEmailService,
  ) {}

  async execute({
    name,
    email,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<void> {
    const exists = await this._authRepository.findByEmail(email);

    if (exists) {
      throw new CustomError(
        HttpStatusCodes.CONFLICT,
        MESSAGES.AUTH_EMAIL_EXISTS,
      );
    }

    const otp = await this._otpService.createOtp(email);

    const emailOptions: IEmailTemplate = {
      name,
      email,
      otp,
      subject: "Type Grid Sign Up OTP",
    };

    await this._emailService.sentOtp(emailOptions);
  }
}
