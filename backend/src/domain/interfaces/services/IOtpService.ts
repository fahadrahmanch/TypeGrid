export interface IOtpService{
    createOtp(email:String):string
    storeOtp(otp:String,email:String):void
    verifyOtp(otp:string,email:string):Boolean
}