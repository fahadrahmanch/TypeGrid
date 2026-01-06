import { IcompanyFindUseCase } from "../../../../domain/interfaces/useCases/auth/ICompanyFindUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/user/IBaseRepository";
import { companyEntity } from "../../../../domain/entities/user/CompanyEntiriy";
import { MESSAGES } from "../../../../domain/constants/messages";
export class companyFindUseCase implements IcompanyFindUseCase {
    constructor(
        private _baseRepository: IBaseRepository<any>
    ) {

    }
    async execute(companyID: string): Promise<companyEntity> {
        const company = await this._baseRepository.findById(companyID);
        if (!company) {
            throw new Error(MESSAGES.INVALID_COMPANY_REFERENCE);
        }
        if (company.status != "active") {
            throw new Error(MESSAGES.COMPANY_ACCOUNT_INACTIVE);
        }
       return new companyEntity({
                    companyName:company.companyName,
                    // description:company.description,
                    address:company.address,
                    email:company.email,
                    number:company.number,
                    OwnerId:company.OwnerId,
                    status: "active",
                });
    }
}