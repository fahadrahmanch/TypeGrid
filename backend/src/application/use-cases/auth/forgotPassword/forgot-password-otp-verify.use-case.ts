import { IOtpService } from "../../../../domain/interfaces/services/otp-service.interface";
import { IForgotPasswordOtpVerifyUseCaseUseCase } from "../../interfaces/auth/forgot-password-otp-verify.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
export class ForgotPasswordOtpVerifyUseCase implements IForgotPasswordOtpVerifyUseCaseUseCase {
  constructor(private _otpservice: IOtpService) {}
  async verify(otp: string, email: string): Promise<void> {
    const verifry = await this._otpservice.verifyOtp(otp, email);
    if (!verifry) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.OTP_VERIFICATION_FAILED,
      );
    }
  }
}
