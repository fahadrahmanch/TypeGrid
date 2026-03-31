import { IRejectCompanyUseCase } from "../../interfaces/admin/reject-company.interface";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/company-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { IEmailService } from "../../../../domain/interfaces/services/email-service.interface";

export class RejectCompanyUseCase implements IRejectCompanyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private _emailService: IEmailService,
  ) {}

  async execute(companyId: string, rejectionReason: string): Promise<void> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new Error(MESSAGES.COMPANY_NOT_FOUND_OR_REMOVED);
    }
    company.status = "reject";
    company.rejectionReason = rejectionReason;
    await this.companyRepository.update(company);
    await this._emailService.sendMail({
      from: process.env.EMAIL_USER,
      to: company.email,
      subject: "❌ Company Application Rejected",
      text: `Your company application was rejected. Reason: ${rejectionReason}`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">
        <h2 style="color:#e74c3c;">Company Application Rejected ❌</h2>

        <p>Hello,</p>

        <p>
          Unfortunately, your company application
          <strong>${company.companyName}</strong> has been rejected.
        </p>

        <p>
          <strong>Reason:</strong><br/>
          ${rejectionReason}
        </p>

        <p>
          You may re-apply after correcting the above issues.
        </p>

        <p style="margin-top:20px;">
          Regards,<br/>
          <strong>Support Team</strong>
        </p>
      </div>
    `,
    });
  }
}
