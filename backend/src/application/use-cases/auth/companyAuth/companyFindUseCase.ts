import { IcompanyFindUseCase } from "../../../../domain/interfaces/usecases/auth/ICompanyFindUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/user/IBaseRepository";
import { companyEntity } from "../../../../domain/entities/CompanyEntiriy";
export class companyFindUseCase implements IcompanyFindUseCase {
    constructor(
        private _baseRepository: IBaseRepository<any>
    ) {

    }
    async execute(companyID: string): Promise<companyEntity> {
        const company = await this._baseRepository.findById(companyID);
        if (!company) {
            throw new Error("Invalid company reference\"");
        }
        if (company.status != "active") {
            throw new Error("Company account is inactive");
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