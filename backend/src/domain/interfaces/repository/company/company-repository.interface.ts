import { CompanyEntity } from "../../../entities";
export interface ICompanyRepository  {
  create(data: Partial<CompanyEntity>): Promise<CompanyEntity>;
  findById(id: string): Promise<CompanyEntity | null>;
  update(data: Partial<CompanyEntity>): Promise<CompanyEntity | null>;
  delete(id: string): Promise<CompanyEntity | null>;
  find(filter?: any): Promise<CompanyEntity[]>;
  findOne(filter?: any): Promise<CompanyEntity | null>;
  getCompanies(
    status: string,
    searchText: string,
    page: number,
    limit: number,
  ): Promise<{ companies: CompanyEntity[]; total: number }>;
}
