import { companyRequestController } from "../controllers/user/companyRequestController";
import { companyRequestUseCase } from "../../application/use-cases/user/companyRequestUseCase";
import { BaseRepository } from "../../infrastructure/db/base/BaseRepository";
import { Company } from "../../infrastructure/db/models/company/companySchema";
const baseRepo=new BaseRepository(Company);
const CompanyRequestUseCase=new companyRequestUseCase(baseRepo);
export const injectCompanyRequestController=new companyRequestController(CompanyRequestUseCase);