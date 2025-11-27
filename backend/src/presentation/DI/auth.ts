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
import { googleAuthUseCase } from "../../application/use-cases/auth/googleAuth/googleAuthUseCase";
import { FindUserByIdEmailCase } from "../../application/use-cases/auth/findUserByEmailUseCase";
import { forgotPassword } from "../../application/use-cases/auth/forgotPassword/forgotPasswordUseCase";
import { ForgotPasswordOtpVerify } from "../../application/use-cases/auth/forgotPassword/ForgotPasswordOtpVerify";
import { createNewPassword } from "../../application/use-cases/auth/forgotPassword/createNewPasswordUseCase";
import { companyFindUseCase } from "../../application/use-cases/auth/companyAuth/companyFindUseCase";
import { Company } from "../../infrastructure/db/models/company/companySchema";
import { BaseRepository } from "../../infrastructure/db/base/BaseRepository";
//auth
const AuthRepository = new authRepository();
const baseRepo = new BaseRepository(Company);
const EmailServive = new EmailService();
const caching = new Caching();
const hashService = new HashService();
const otpService = new OtpService(caching);
const ResentOtpUseCase = new resentOtpUseCase(
  otpService,
  EmailServive,
  AuthRepository
);
const completeSignup = new completeSignupUseCase(
  otpService,
  hashService,
  AuthRepository
);
const RegisterUser = new registerUser(AuthRepository, otpService, EmailServive);
const LoginUserCase = new loginUseCase(AuthRepository, hashService);
const tokenService = new TokenService();
const forgotPasswordOtpVerify = new ForgotPasswordOtpVerify(otpService);
const GoogleAuthUseCase = new googleAuthUseCase(AuthRepository);
const findUserByIdEmailCase = new FindUserByIdEmailCase(AuthRepository);
const ForgotPassword = new forgotPassword(
  otpService,
  EmailServive,
  AuthRepository
);
const CreateNewPassword = new createNewPassword(AuthRepository, hashService);
const CompanyFindUseCase = new companyFindUseCase(baseRepo);

export const injectAuthController = new authController(
  RegisterUser,
  completeSignup,
  ResentOtpUseCase,
  LoginUserCase,
  tokenService,
  GoogleAuthUseCase,
  findUserByIdEmailCase,
  ForgotPassword,
  forgotPasswordOtpVerify,
  CreateNewPassword,
  CompanyFindUseCase
);
