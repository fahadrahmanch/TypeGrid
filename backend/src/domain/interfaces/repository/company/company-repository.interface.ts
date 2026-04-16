import { CompanyEntity } from '../../../entities';
import { IBaseRepository } from '../base-repository.interface';
export interface ICompanyRepository extends IBaseRepository<CompanyEntity> {
  getCompanies(
    status: string,
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ companies: CompanyEntity[]; total: number }>;
}
