import { registerController } from "../controllers/auth/RegisterController";
import { registerUser } from "../../application/use-cases/auth/signup/signupUseCase";
import { userRepository } from "../../infrastructure/db/repositories/user/userRepository";
import { OtpService } from "../../application/services/otpServices";
import { EmailService } from "../../application/services/emailService";
import { Caching } from "../../application/services/CachingService";
import { completeSignupUseCase } from "../../application/use-cases/auth/otp/completeSignupUseCase";
import { HashService } from "../../application/services/hashService";
const UserRepository=new userRepository();
const _EmailServive=new EmailService();
const caching=new Caching();
const hashService=new HashService()
const otpService=new OtpService(caching);
const completeSignup=new completeSignupUseCase(otpService,hashService);
const RegisterUser=new registerUser(UserRepository,otpService,_EmailServive);
export const injectRegisterController=new registerController(RegisterUser,completeSignup);
