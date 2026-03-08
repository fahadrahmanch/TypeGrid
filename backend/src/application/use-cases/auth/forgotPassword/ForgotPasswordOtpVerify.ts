import { IOtpService } from "../../../../domain/interfaces/services/IOtpService";
import { IForgotPasswordOtpVerify } from "../../interfaces/auth/IForgotPasswordOtpVerify";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
export class ForgotPasswordOtpVerify implements IForgotPasswordOtpVerify {
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
