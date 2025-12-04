import { companyEntity } from "../../../domain/entities/CompanyEntiriy";
import { IGetCompanysUseCase } from "../../../domain/interfaces/usecases/admin/IGetCompanysUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/user/IBaseRepository";
import { Company } from "../../../infrastructure/db/models/company/companySchema";
export class getCompanysUseCase implements IGetCompanysUseCase{
    constructor(
        private _baseRepository:IBaseRepository<any>,
    ){}
    async execute():Promise<companyEntity[]>{
    const companies = await this._baseRepository.find();
    return companies;
    }
}