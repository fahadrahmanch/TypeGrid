export interface IForgotPasswordOtpVerifyUseCaseUseCase {
  verify(otp: string, email: string): Promise<void>;
}
