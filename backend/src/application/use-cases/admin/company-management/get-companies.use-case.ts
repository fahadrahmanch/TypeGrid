import { CompanyEntity } from '../../../../domain/entities';
import { IGetCompaniesUseCase } from '../../interfaces/admin/get-companies.interface';
import { ICompanyRepository } from '../../../../domain/interfaces/repository/company/company-repository.interface';

/**
 * Use case for retrieving all companies.
 *
 * Responsible for fetching a list of companies from the repository.
 *
 * @implements {IGetCompaniesUseCase}
 *
 * @example
 * const useCase = new GetCompaniesUseCase(companyRepository);
 * const companies = await useCase.execute();
 */
export class GetCompaniesUseCase implements IGetCompaniesUseCase {
  constructor(private readonly _companyRepository: ICompanyRepository) {}
  /**
   * Executes the use case.
   * @returns Promise containing a list of companies
   */
  async execute(
    status: string,
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ companies: CompanyEntity[]; total: number }> {
    const companies = await this._companyRepository.getCompanies(status, searchText, page, limit);

    return companies;
  }
}
