export interface IForgotPasswordOtpVerify{
    verify(otp:string,email:string):Promise<void>
}