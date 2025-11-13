import { ICompleteSignupUseCase } from "../../../../domain/interfaces/usecases/auth/ICompleteSignupUseCase";
import { IOtpService } from "../../../../domain/interfaces/services/IOtpService";
import { AuthUserEntity } from "../../../../domain/entities";
import { IHashService } from "../../../../domain/interfaces/services/IHashService";
import logger from "../../../../utils/logger";
export class completeSignupUseCase implements ICompleteSignupUseCase{
    constructor(
        private _otpservice:IOtpService,
        private _hashService:IHashService
    ){}
    async otp(otp:string,name:string,email:string,password:string):Promise<void>{
    const verifry=await this._otpservice.verifyOtp(otp,email);
    if(!verifry){
         throw new Error("verify otp is not matched");
    }
    const hashedPassword=await this._hashService.hash(password)
    const newUser=new AuthUserEntity({
        name:name,
        email:email,
        password: hashedPassword,
        role: "user",
        KeyBoardLayout: "QWERTY",
        status: "active"
    })
    }
    
}