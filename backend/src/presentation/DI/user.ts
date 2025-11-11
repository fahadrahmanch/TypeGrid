import { registerController } from "../controllers/user/register/userRegisterController";
import { registerUser } from "../../application/use-cases/user/signup/registerUseCase";
import { userRepository } from "../../infrastructure/db/repositories/user/userRepository";
import { OtpService } from "../../application/services/otpServices";
import { EmailService } from "../../application/services/emailService";
const UserRepository=new userRepository()
const _EmailServive=new EmailService()
const otpService=new OtpService()
const RegisterUser=new registerUser(UserRepository,otpService,_EmailServive)
export const injectRegisterController=new registerController(RegisterUser)
