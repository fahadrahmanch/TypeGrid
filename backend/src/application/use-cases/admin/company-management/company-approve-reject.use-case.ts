import { ICompanyApproveRejectUseCase } from "../../interfaces/admin/company-approve-reject.interface";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/company-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IEmailService } from "../../../../domain/interfaces/services/email-service.interface";
export class CompanyApproveRejectUseCase implements ICompanyApproveRejectUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private userRepository: IUserRepository,
    private _emailService: IEmailService,
  ) {}

  async approve(companyId: string): Promise<void> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new Error(MESSAGES.COMPANY_NOT_FOUND_OR_REMOVED);
    }
    const OwnerId = company.OwnerId;
    if (!OwnerId) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.COMPANY_OWNER_NOT_FOUND,
      );
    }

    const user = await this.userRepository.findById(OwnerId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }
    user.role = "companyAdmin";
    company.status = "active";

    await this.userRepository.update(user);
    await this.companyRepository.update(company);

    await this._emailService.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "🎉 Company Approved",
      text: `Hello ${user.name}, your company has been approved successfully.`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">
        <h2 style="color:#27ae60;">Company Approved ✅</h2>

        <p>Hello <strong>${user.name}</strong>,</p>

        <p>
          Congratulations! Your company <strong>${company.companyName}</strong>
          has been approved successfully.
        </p>

        <p>
          You now have access to all features as a
          <strong>Company Admin</strong>.
        </p>

        <p style="margin-top:20px;">
          Regards,<br/>
          <strong>Support Team</strong>
        </p>
      </div>
    `,
    });
  }

  async reject(companyId: string, rejectionReason: string): Promise<void> {
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
