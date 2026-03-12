export interface IForgotPasswordOtpVerifyUseCase {
  execute(otp: string, email: string): Promise<void>;
}
