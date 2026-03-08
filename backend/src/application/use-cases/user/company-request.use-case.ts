import { ICompanyRequestUseCase } from "../interfaces/user/company-request.interface";
import { ICompanyRepository } from "../../../domain/interfaces/repository/company/company-repository.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { CustomError } from "../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../domain/enums/http-status-codes.enum";
import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { CompanyEntity } from "../../../domain/entities";
export class CompanyRequestUseCase implements ICompanyRequestUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private userRepository: IUserRepository,
  ) {}
  async execute(
    OwnerId: string,
    companyName: string,
    address: string,
    email: string,
    number: string,
  ): Promise<void> {
    const company = new CompanyEntity({
      companyName,
      address,
      email,
      OwnerId,
      number,
      status: "pending",
    });
    const exists = await this.companyRepository.find({ OwnerId });

    if (exists.length > 0) {
      throw new CustomError(
        HttpStatusCodes.CONFLICT,
        MESSAGES.COMPANY_ALREADY_REGISTERED,
      );
    }
    const user = await this.userRepository.findById(OwnerId);
    const companyDoc = await this.companyRepository.create(company);
    (user as any).CompanyId = (companyDoc as any)._id;
    await this.userRepository.update(user as any);
  }
}
