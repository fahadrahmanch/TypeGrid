import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { AuthUserEntity } from "../../../../domain/entities";
import { IGetCompanyUsersUseCase } from "../../interfaces/companyAdmin/IGetCompanyUsersUseCase";
export class getCompanyUsersUseCase implements IGetCompanyUsersUseCase{
    constructor(
        private _baseRepository:IBaseRepository<any>
        
    ){}
    async execute(CompanyId:string):Promise<AuthUserEntity[]>{
      const CompanyUsers = await this._baseRepository.find({ CompanyId: CompanyId ,role:"companyUser"});
      return CompanyUsers;
    }
}