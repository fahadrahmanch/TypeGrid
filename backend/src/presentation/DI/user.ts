import { companyRequestController } from "../controllers/user/companyRequestController";
import { companyRequestUseCase } from "../../application/use-cases/user/companyRequestUseCase";
import { BaseRepository } from "../../infrastructure/db/base/BaseRepository";
import { Company } from "../../infrastructure/db/models/company/companySchema";
import { userController } from "../controllers/user/userController";
import { TokenService } from "../../application/services/tokenService";
import { findUserUseCase } from "../../application/use-cases/user/findUserUseCase";
import { User } from "../../infrastructure/db/models/userSchema";
import { AuthUserEntity } from "../../domain/entities";
import { updateUserUseCase } from "../../application/use-cases/user/updateUserUseCase";
const baseRepo=new BaseRepository(Company);
const CompanyRequestUseCase=new companyRequestUseCase(baseRepo);
const tokenService=new TokenService()
const baseRepoUser=new BaseRepository<AuthUserEntity>(User)
const FindUserUseCase=new findUserUseCase(baseRepoUser)
export const injectCompanyRequestController=new companyRequestController(CompanyRequestUseCase,tokenService,FindUserUseCase);
const UpdateUserUseCase=new updateUserUseCase(baseRepoUser)
export const injectUserController =new userController(tokenService,FindUserUseCase,UpdateUserUseCase)