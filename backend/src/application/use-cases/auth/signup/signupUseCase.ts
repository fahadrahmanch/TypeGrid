import { InterfaceUser } from "../../../../domain/interfaces/user/InterfaceUser";
import { userEntity } from "../../../../domain/entities/userEntity";
import { IRegisterUseCase } from "../../../../domain/interfaces/usecases/auth/IRegisterUseCase";
import { IUserRepostory } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { IOtpService } from "../../../../domain/interfaces/services/IOtpService";
import { IEmailService } from "../../../../domain/interfaces/services/IEmailService";
import { IEmailTemplate } from "../../../../domain/interfaces/emailTemplates/IEmailTemplate";
export class registerUser implements IRegisterUseCase{
    constructor(
        private userRepository:IUserRepostory,
        private otpService:IOtpService,
        private _EmailService:IEmailService
    ){
    }
    async createUser({ name, email, password }: { name: string; email: string; password: string }):Promise<void>{
            if(!name||!email||!password){
                throw new Error("All fields are required");
            }
            const exists=await this.userRepository.findByEmail(email);
            if(exists){
                throw new Error("User already exists with this email");
            }
            const otp=await this.otpService.createOtp(email);
            const emailOptions:IEmailTemplate={
                name,
                email,
                otp,
                subject:"Type Grid Sign Up Otp",
                
            };
            await this._EmailService.sentOtp(emailOptions);     
    }
}
