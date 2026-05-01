import { IApproveCompanyUseCase } from "../../interfaces/admin/approve-company.interface";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/company-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IEmailService } from "../../../../domain/interfaces/services/email-service.interface";

export class ApproveCompanyUseCase implements IApproveCompanyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private userRepository: IUserRepository,
    private _emailService: IEmailService
  ) {}

  async execute(companyId: string): Promise<void> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND_OR_REMOVED);
    }
    const OwnerId = company.OwnerId;
    if (!OwnerId) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPANY_OWNER_NOT_FOUND);
    }

    const user = await this.userRepository.findById(OwnerId.toString());
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    user.role = "companyAdmin";
    company.status = "inactive";

    await this.userRepository.update(user);
    await this.companyRepository.update(company);

    await this._emailService.sendMail({
      from: process.env.EMAIL_USER as string,
      to: user.email,
      subject: "🎉 Company Approved please payment for activate your company",
      text: `Hello ${user.name}, your company has been approved successfully.`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">
        <h2 style="color:#27ae60;">Company Approved but inactive ✅</h2>

        <p>Hello <strong>${user.name}</strong>,</p>

        <p>
          Congratulations! Your company <strong>${company.companyName}</strong>
          has been approved successfully.but it is inactive please payment for activate your company
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
}
