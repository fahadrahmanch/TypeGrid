export interface ICompleteSignupUseCase{
    otp(otp:string,email:string):Promise<void>

}