import { getUsersUseCase } from "../../application/use-cases/admin/getUsersUseCase";
import { userManageController } from "../controllers/admin/userManageController";
import { authRepository } from "../../infrastructure/db/repositories/auth/authRepository";
import { getCompanysUseCase } from "../../application/use-cases/admin/getCompanysUseCase";
import { BaseRepository } from "../../infrastructure/db/base/BaseRepository";
import { Company } from "../../infrastructure/db/models/company/companySchema";
import { companyManageController } from "../controllers/admin/companyManageController";
import { companyApproveRejectUsecase } from "../../application/use-cases/admin/companyApproveRejectUsecase";
import { User } from "../../infrastructure/db/models/userSchema";
const authRepo = new authRepository();
const baseRepoUser=new BaseRepository(User)
const baseRepoCompany=new BaseRepository(Company)
const GetUsers = new getUsersUseCase(authRepo);
const getCompanyUseCase=new getCompanysUseCase(baseRepoCompany)
const CompanyApproveRejectUseCase=new companyApproveRejectUsecase(baseRepoCompany,baseRepoUser)
export const injectCompanyManageController=new companyManageController(getCompanyUseCase,CompanyApproveRejectUseCase)
export const injectUserManageController = new userManageController(GetUsers);
