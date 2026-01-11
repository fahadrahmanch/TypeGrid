export interface ICompleteSignupUseCase{
    otp(otp:string,name:string,email:string,password:string):Promise<void>

}