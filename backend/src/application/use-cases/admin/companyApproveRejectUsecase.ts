import { ICompanyApproveRejectUsecase } from "../../../domain/interfaces/usecases/admin/ICompanyApproveRejectUsecase";
import { IBaseRepository } from "../../../domain/interfaces/repository/user/IBaseRepository";
import { MESSAGES } from "../../../domain/constants/messages";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
export class companyApproveRejectUsecase
  implements ICompanyApproveRejectUsecase
{
  constructor(
    private _baseRepositoryCompany: IBaseRepository<any>,
    private _baseRepositoryUser:IBaseRepository<any>,
    private _emailService:IEmailService
  ) {}

  async approve(companyId: string): Promise<void> {
    const company = await this._baseRepositoryCompany.findById(companyId);
    if (!company) {
      throw new Error(MESSAGES.COMPANY_NOT_FOUND_OR_REMOVED);
    }
    const OwnerId=company.OwnerId;

    const user=await this._baseRepositoryUser.findById(OwnerId);
    user.role="companyAdmin";
    company.status = "active";

    await this._baseRepositoryUser.update(user);
    await this._baseRepositoryCompany.update(company);
    await this._emailService.sendMail({
      from:process.env.EMAIL_USER,
      to:user.email,
      subject:"Company Approved",
      text:`Your company has been approved successfully. You can now access all the features as a company admin.`
    });
  }
  async reject(companyId: string,rejectionReason:string): Promise<void> {
    const company = await this._baseRepositoryCompany.findById(companyId);
    if (!company) {
      throw new Error(MESSAGES.COMPANY_NOT_FOUND_OR_REMOVED);
    }
    company.status = "reject";
    company.rejectionReason=rejectionReason;
    await this._baseRepositoryCompany.update(company);
    await this._emailService.sendMail({
      from:process.env.EMAIL_USER,
      to:company.email,
      subject:"Company Rejected",
      text:`Your company ${company.name} has been rejected. Reason: ${rejectionReason}`
    });
  }
}
