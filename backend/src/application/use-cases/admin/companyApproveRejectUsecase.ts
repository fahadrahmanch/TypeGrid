import { ICompanyApproveRejectUsecase } from "../../../domain/interfaces/usecases/admin/ICompanyApproveRejectUsecase";
import { IBaseRepository } from "../../../domain/interfaces/repository/user/IBaseRepository";
import { MESSAGES } from "../../../domain/constants/messages";
export class companyApproveRejectUsecase
  implements ICompanyApproveRejectUsecase
{
  constructor(
    private _baseRepositoryCompany: IBaseRepository<any>,
    private _baseRepositoryUser:IBaseRepository<any>
  ) {}

  async approve(companyId: string): Promise<void> {
    const company = await this._baseRepositoryCompany.findById(companyId);
    if (!company) {
      throw new Error(MESSAGES.COMPANY_NOT_FOUND_OR_REMOVED);
    }
    const OwnerId=company.OwnerId;
    
    const user=await this._baseRepositoryUser.findById(OwnerId);
    console.log("user",user)
    user.role="companyAdmin";
    company.status = "active";
    await this._baseRepositoryUser.update(user);
    await this._baseRepositoryCompany.update(company);
  }
  async reject(companyId: string): Promise<void> {
    const company = await this._baseRepositoryCompany.findById(companyId);
    if (!company) {
      throw new Error(MESSAGES.COMPANY_NOT_FOUND_OR_REMOVED);
    }
    company.status = "reject";
    await this._baseRepositoryCompany.update(company);
  }
}
