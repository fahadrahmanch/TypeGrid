import { ICompanyRequestUseCase } from "../../../domain/interfaces/user/ICompanyRequestUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/user/IBaseRepository";
import { companyEntity } from "../../../domain/entities/CompanyEntiriy";
export class companyRequestUseCase implements ICompanyRequestUseCase {
    constructor(
        private _baseRepository: IBaseRepository<any>
    ) { }
    async execute(companyName: string, address: string, email: string, number: string): Promise<void> {

        const company = new companyEntity({
            companyName,
            address,
            email,
            number,
            status: "pending",
        });
         await this._baseRepository.create(company);

    }

}