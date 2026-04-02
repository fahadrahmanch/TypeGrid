import { ICompanyFindUseCase } from "../../interfaces/auth/company-find.interface";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/company-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { CompanyEntity } from "../../../../domain/entities";
export class CompanyFindUseCase implements ICompanyFindUseCase {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  /**
   * Finds and validates a company by its ID.
   *
   * @param companyId - The unique identifier of the company
   * @returns The found company entity
   * @throws CustomError if company is not found
   * @throws CustomError if company is inactive
   */
  async execute(companyId: string): Promise<CompanyEntity> {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.INVALID_COMPANY_REFERENCE,
      );
    }

    if (company.status !== "active") {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        MESSAGES.COMPANY_ACCOUNT_INACTIVE,
      );
    }

    return company;
  }
}
