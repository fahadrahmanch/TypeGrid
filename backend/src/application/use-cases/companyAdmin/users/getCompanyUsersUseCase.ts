import { AuthUserEntity } from "../../../../domain/entities";
import { IBaseRepository } from "../../../../domain/interfaces/repository/user/IBaseRepository";
import { InterfaceUser } from "../../../../domain/interfaces/user/InterfaceUser";
import { IGetCompanyUsersUseCase } from "../../../../domain/interfaces/usecases/companyAdmin/IGetCompanyUsersUseCase";
export class getCompanyUsersUseCase implements IGetCompanyUsersUseCase{
    constructor(
        private _baseRepository:IBaseRepository<any>
        
    ){}
    async execute(CompanyId:string):Promise<InterfaceUser[]>{
      const CompanyUsers = await this._baseRepository.find({ CompanyId: CompanyId });
      return CompanyUsers;
    }
}