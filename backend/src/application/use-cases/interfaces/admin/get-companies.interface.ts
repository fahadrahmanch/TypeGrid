import { CompanyEntity } from "../../../../domain/entities";

export interface IGetCompaniesUseCase {
  execute(status:string,searchText:string,page:number,limit:number): Promise<{companies:CompanyEntity[],total:number}>;
}
