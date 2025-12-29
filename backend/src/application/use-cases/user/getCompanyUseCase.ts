import { IGetCompanyUseCase } from "../../../domain/interfaces/usecases/user/IGetCompanyUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/user/IBaseRepository";
export class getCompanyUseCase implements IGetCompanyUseCase{
    constructor(
    private _baseRepository: IBaseRepository<any>    
    ){}
    async execute(companyId:string):Promise<any>{
    const company=await this._baseRepository.findById(companyId);
    return company;
    }
 
}