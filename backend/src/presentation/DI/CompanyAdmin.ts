import { CompanyUserController } from "../controllers/company-admin/users/CompanyUserController";
import { addUserUseCase } from "../../application/use-cases/companyAdmin/users/addUserUseCase";
import { User } from "../../infrastructure/db/models/userSchema";
import { BaseRepository } from "../../infrastructure/db/base/BaseRepository";
import { HashService } from "../../application/services/hashService";
import { TokenService } from "../../application/services/tokenService";
import { findUserUseCase } from "../../application/use-cases/user/findUserUseCase";
const baseRepoUser=new BaseRepository(User)
const tokenService=new TokenService()
const hashService = new HashService();
const FindUserUseCase=new findUserUseCase(baseRepoUser)
const AddUserUseCase=new addUserUseCase(baseRepoUser,hashService)
export const injectCompanyUserController=new CompanyUserController(AddUserUseCase,tokenService,FindUserUseCase)