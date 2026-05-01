import { ICompanyReApplyUseCase } from "../interfaces/user/company-re-apply.interface";
import { CompanyReApplyDTO } from "../../DTOs/user/company-re-apply.dto";
import { CompanyEntity } from "../../../domain/entities";
import { ICompanyRepository } from "../../../domain/interfaces/repository/company/company-repository.interface";
import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { CustomError } from "../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../domain/constants/messages";
export class CompanyReApplyUseCase implements ICompanyReApplyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private userRepository: IUserRepository
  ) {}
  async execute(data: CompanyReApplyDTO): Promise<void> {
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const company = new CompanyEntity({
      _id: (user as any).CompanyId,
      companyName: data.companyName,
      address: data.address,
      email: data.email,
      OwnerId: data.userId,
      number: data.number,
      document: data.document,
      status: "pending",
      rejectionReason: "",
    });
    await this.companyRepository.update(company);
  }
}
