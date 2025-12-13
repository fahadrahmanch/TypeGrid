import { ICompanyRequestUseCase } from "../../../domain/interfaces/user/ICompanyRequestUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/user/IBaseRepository";
import { companyEntity } from "../../../domain/entities/CompanyEntiriy";
export class companyRequestUseCase implements ICompanyRequestUseCase {
    constructor(
        private _baseRepositoryCompany: IBaseRepository<any>,
        private _baseRepositoryUser:IBaseRepository<any>
    ) { }
    async execute(OwnerId:string,companyName: string, address: string, email: string, number: string): Promise<void> {
        const company = new companyEntity({
            companyName,
            address,
            email,
            OwnerId,
            number,
            status: "pending",
        });
        const exists=await this._baseRepositoryCompany.find({OwnerId})
        
if (exists.length > 0) {
  throw new Error("You have already registered a company");
}
        const user=await this._baseRepositoryUser.findById(OwnerId);
        const companyDoc= await this._baseRepositoryCompany.create(company);
        user.CompanyId=companyDoc._id;
        await this._baseRepositoryUser.update(user); 
    }

}