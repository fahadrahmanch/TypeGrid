import { AuthController } from "../controllers/auth/auth.controller";
import { SignupUseCase } from "../../application/use-cases/auth/signup/signup.use-case";
import { AuthRepository } from "../../infrastructure/db/repositories/auth/auth.repository";
import { OtpService } from "../../application/services/otp.service";
import { EmailService } from "../../infrastructure/services/email.service";
import { CachingService } from "../../application/services/caching.service";
import { CompleteSignupUseCase } from "../../application/use-cases/auth/signup/complete-signup.use-case";
import { HashService } from "../../application/services/hash.service";
import { ResentOtpUseCase } from "../../application/use-cases/auth/otp/resent-otp.use-case";
import { LoginUseCase } from "../../application/use-cases/auth/login/login.use-case";
import { TokenService } from "../../application/services/token.service";
import { GoogleAuthUseCase } from "../../application/use-cases/auth/googleAuth/google-auth.use-case";
import { FindUserByEmailUseCase } from "../../application/use-cases/auth/find-user-by-email.use-case";
import { ForgotPasswordUseCase } from "../../application/use-cases/auth/forgotPassword/forgot-password.use-case";
import { ForgotPasswordOtpVerifyUseCase } from "../../application/use-cases/auth/forgotPassword/forgot-password-otp-verify.use-case";
import { CreateNewPasswordUseCase } from "../../application/use-cases/auth/forgotPassword/create-new-password.use-case";
import { CompanyFindUseCase } from "../../application/use-cases/auth/companyAuth/company-find.use-case";
import { Company } from "../../infrastructure/db/models/company/company.schema";
import { CompanyRepository } from "../../infrastructure/db/repositories/company/company.repository";

//auth
const authRepositoryInstance = new AuthRepository();
const companyRepository = new CompanyRepository(Company);
const emailService = new EmailService();
const cachingService = new CachingService();
const hashService = new HashService();
const otpService = new OtpService(cachingService);

const resentOtpUseCase = new ResentOtpUseCase(
  otpService,
  emailService,
  authRepositoryInstance,
);
const completeSignup = new CompleteSignupUseCase(
  otpService,
  hashService,
  authRepositoryInstance,
);
const registerUser = new SignupUseCase(authRepositoryInstance, otpService, emailService);
const loginUseCase = new LoginUseCase(authRepositoryInstance, hashService);
const tokenService = new TokenService();
const forgotPasswordOtpVerify = new ForgotPasswordOtpVerifyUseCase(otpService);
const googleAuthUseCase = new GoogleAuthUseCase(authRepositoryInstance);
const findUserByEmailUseCase = new FindUserByEmailUseCase(authRepositoryInstance);
const forgotPassword = new ForgotPasswordUseCase(
  otpService,
  emailService,
  authRepositoryInstance,
);
const createNewPassword = new CreateNewPasswordUseCase(authRepositoryInstance, hashService);
const companyFindUseCase = new CompanyFindUseCase(companyRepository);

export const injectAuthController = new AuthController(
  registerUser,
  completeSignup,
  resentOtpUseCase,
  loginUseCase,
  tokenService,
  googleAuthUseCase,
  findUserByEmailUseCase,
  forgotPassword,
  forgotPasswordOtpVerify,
  createNewPassword,
  companyFindUseCase,
);
