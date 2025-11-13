import { ICompleteSignupUseCase } from "../../../../domain/interfaces/usecases/auth/ICompleteSignupUseCase";
import { IOtpService } from "../../../../domain/interfaces/services/IOtpService";
export class completeSignupUseCase implements ICompleteSignupUseCase{
    constructor(
        private _otpservice:IOtpService
    ){}
    async otp(otp:string,email:string):Promise<void>{
    const verifry=await this._otpservice.verifyOtp(otp,email);
    console.log(verifry);
    }
}