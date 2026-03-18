import { CompanyEntity } from "../../../entities";
export interface ICompanyRepository  {
  create(data: any): Promise<any>;
  findById(id: string): Promise<any>;
  update(data: any): Promise<any>;
  delete(id: string): Promise<any>;
  find(filter?: any): Promise<any>;
  findOne(filter?: any): Promise<any>;
  getCompanies(
    status: string,
    searchText: string,
    page: number,
    limit: number,
  ): Promise<{ companies: any[]; total: number }>;
}
