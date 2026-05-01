import { IOtpService } from "../../../../domain/interfaces/services/otp-service.interface";
import { IForgotPasswordOtpVerifyUseCase } from "../../interfaces/auth/forgot-password-otp-verify.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Verifies an OTP during the forgot password process.
 * Throws BAD_REQUEST if inputs are missing or OTP is invalid.
 */
export class ForgotPasswordOtpVerifyUseCase implements IForgotPasswordOtpVerifyUseCase {
  constructor(private readonly _otpService: IOtpService) {}

  async execute(otp: string, email: string): Promise<void> {
    if (!otp || !email) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    const verified = await this._otpService.verifyOtp(otp, email);

    if (!verified) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.OTP_VERIFICATION_FAILED);
    }
  }
}
