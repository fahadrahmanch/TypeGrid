import { ICompleteSignupUseCase } from "../../interfaces/auth/ICompleteSignupUseCase";
import { IOtpService } from "../../../../domain/interfaces/services/IOtpService";
import { AuthUserEntity } from "../../../../domain/entities";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { IHashService } from "../../../../domain/interfaces/services/IHashService";
import { MESSAGES } from "../../../../domain/constants/messages";
export class completeSignupUseCase implements ICompleteSignupUseCase{
    constructor(
        private _otpservice:IOtpService,
        private _hashService:IHashService,
        private _authRepository:IAuthRepostory
    ){}
    async otp(otp:string,name:string,email:string,password:string):Promise<void>{
    const verifry=await this._otpservice.verifyOtp(otp,email);
    if(!verifry){
         throw new Error(MESSAGES.OTP_VERIFICATION_FAILED);
    }
    const hashedPassword=await this._hashService.hash(password);
    const newUser=new AuthUserEntity({
        name:name,
        email:email,
        password: hashedPassword,
        role: "user",
        KeyBoardLayout: "QWERTY",
        status: "active"
    });
    await this._authRepository.create(newUser);
    }

}