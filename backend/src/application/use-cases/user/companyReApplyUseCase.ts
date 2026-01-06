import { ICompanyReApplyUseCase } from "../../../domain/interfaces/useCases/user/ICompanyReApplyUseCase";
import { CompanyReApplyDTO } from "../../DTOs/user/CompanyReApplyDTO";
import { companyEntity } from "../../../domain/entities/user/CompanyEntiriy";
import { IBaseRepository } from "../../../domain/interfaces/repository/user/IBaseRepository";
export class companyReApplyUseCase implements ICompanyReApplyUseCase{
    constructor(
        private _baseRepositoryCompany: IBaseRepository<any>,
        private _baseRepositoryUser:IBaseRepository<any>
    ){}
    async execute(data: CompanyReApplyDTO): Promise<void> {
        const user=await this._baseRepositoryUser.findById(data.userId);
           const company = new companyEntity({
            _id:user.CompanyId,
            companyName:data.companyName,
            address:data.address,
            email:data.email,
            OwnerId:data.userId,
            number:data.number,
            status: "pending",
            rejectionReason:""
        });
            await this._baseRepositoryCompany.update(company);
    }
}