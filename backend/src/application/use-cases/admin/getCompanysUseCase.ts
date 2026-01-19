import { companyEntity } from "../../../domain/entities";
import { IGetCompanysUseCase } from "../interfaces/admin/IGetCompanysUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";
export class getCompanysUseCase implements IGetCompanysUseCase{
    constructor(
        private _baseRepository:IBaseRepository<any>,
    ){}
    async execute():Promise<companyEntity[]>{
    const companies = await this._baseRepository.find();
    return companies;
    }
}