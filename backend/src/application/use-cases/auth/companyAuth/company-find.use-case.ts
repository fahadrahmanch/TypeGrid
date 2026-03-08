import { ICompanyFindUseCase } from "../../interfaces/auth/company-find.interface";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/company-repository.interface";
import { CompanyEntity } from "../../../../domain/entities";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
export class CompanyFindUseCase implements ICompanyFindUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute(companyID: string): Promise<CompanyEntity> {
    const company = await this.companyRepository.findById(companyID);
    if (!company) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.INVALID_COMPANY_REFERENCE,
      );
    }
    if (company.status != "active") {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        MESSAGES.COMPANY_ACCOUNT_INACTIVE,
      );
    }
    return new CompanyEntity({
      companyName: company.companyName,
      // description:company.description,
      address: company.address,
      email: company.email,
      number: company.number,
      OwnerId: company.OwnerId,
      status: "active",
    });
  }
}
