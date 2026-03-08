import { IcompanyFindUseCase } from "../../interfaces/auth/ICompanyFindUseCase";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/ICompanyRepository";
import { companyEntity } from "../../../../domain/entities";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
export class companyFindUseCase implements IcompanyFindUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute(companyID: string): Promise<companyEntity> {
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
    return new companyEntity({
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
