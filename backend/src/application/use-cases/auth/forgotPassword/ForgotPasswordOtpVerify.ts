import { IOtpService } from "../../../../domain/interfaces/services/IOtpService";
import { IForgotPasswordOtpVerify } from "../../../../domain/interfaces/usecases/auth/IForgotPasswordOtpVerify";
import { MESSAGES } from "../../../../domain/constants/messages";
export class ForgotPasswordOtpVerify implements IForgotPasswordOtpVerify {
    constructor(
        private _otpservice: IOtpService,
    ) { }
    async verify(otp: string, email: string): Promise<void> {
        const verifry = await this._otpservice.verifyOtp(otp, email);
        if (!verifry) {
            throw new Error(MESSAGES.OTP_VERIFICATION_FAILED);
        }
    }
}