import { authController } from "../controllers/auth/authController";
import { registerUser } from "../../application/use-cases/auth/signup/signupUseCase";
import { authRepository } from "../../infrastructure/db/repositories/auth/authRepository";
import { OtpService } from "../../application/services/otpServices";
import { EmailService } from "../../application/services/emailService";
import { Caching } from "../../application/services/CachingService";
import { completeSignupUseCase } from "../../application/use-cases/auth/signup/completeSignupUseCase";
import { HashService } from "../../application/services/hashService";
import { resentOtpUseCase } from "../../application/use-cases/auth/otp/resentOtpUsecase";
import { loginUseCase } from "../../application/use-cases/auth/login/loginUseCase";
import { TokenService } from "../../application/services/tokenService";
const AuthRepository=new authRepository();
const _EmailServive=new EmailService();
const caching=new Caching();
const hashService=new HashService();
const otpService=new OtpService(caching);
const ResentOtpUseCase=new resentOtpUseCase(otpService,_EmailServive,AuthRepository)
const completeSignup=new completeSignupUseCase(otpService,hashService,AuthRepository);
const RegisterUser=new registerUser(AuthRepository,otpService,_EmailServive);
const LoginUserCase=new loginUseCase(AuthRepository,hashService)
const tokenService=new TokenService()
export const injectAuthController=new authController(RegisterUser,completeSignup,ResentOtpUseCase,LoginUserCase,tokenService);
