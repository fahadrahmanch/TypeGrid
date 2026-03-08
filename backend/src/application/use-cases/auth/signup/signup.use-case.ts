import { IAuthUseCase } from "../../interfaces/auth/auth.interface";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { IOtpService } from "../../../../domain/interfaces/services/otp-service.interface";
import { IEmailService } from "../../../../domain/interfaces/services/email-service.interface";
import { IEmailTemplate } from "../../../DTOs/email/email-template.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
export class SignupUseCase implements IAuthUseCase {
  constructor(
    private userRepository: IAuthRepostory,
    private otpService: IOtpService,
    private _EmailService: IEmailService,
  ) {}
  async createUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<void> {
    if (!name || !email || !password) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.ALL_FIELDS_REQUIRED,
      );
    }
    const exists = await this.userRepository.findByEmail(email);
    if (exists) {
      throw new CustomError(
        HttpStatusCodes.CONFLICT,
        MESSAGES.AUTH_EMAIL_EXISTS,
      );
    }
    const otp = await this.otpService.createOtp(email);
    const emailOptions: IEmailTemplate = {
      name,
      email,
      otp,
      subject: "Type Grid Sign Up Otp",
    };
    await this._EmailService.sentOtp(emailOptions);
  }
}
