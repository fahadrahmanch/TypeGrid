import { ICompanyReApplyUseCase } from "../interfaces/user/ICompanyReApplyUseCase";
import { CompanyReApplyDTO } from "../../DTOs/user/CompanyReApplyDTO";
import { companyEntity } from "../../../domain/entities";
import { ICompanyRepository } from "../../../domain/interfaces/repository/company/ICompanyRepository";
import { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";
export class companyReApplyUseCase implements ICompanyReApplyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private userRepository: IUserRepository,
  ) {}
  async execute(data: CompanyReApplyDTO): Promise<void> {
    const user = await this.userRepository.findById(data.userId);
    const company = new companyEntity({
      _id: (user as any).CompanyId,
      companyName: data.companyName,
      address: data.address,
      email: data.email,
      OwnerId: data.userId,
      number: data.number,
      status: "pending",
      rejectionReason: "",
    });
    await this.companyRepository.update(company);
  }
}
